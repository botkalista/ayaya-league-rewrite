#include <napi.h>
#include <iostream>
#include <Windows.h>
#include <vector>
#include <thread>
#include <chrono>
#include <tlhelp32.h>
#include <psapi.h>

// ------------------------ C++ FUNCTIONS ---------------------------------------------

uint32_t find_process(std::wstring name) {
    uint32_t result = 0;

    HANDLE process_snap;
    PROCESSENTRY32 pe32;
    process_snap = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);

    if (process_snap == INVALID_HANDLE_VALUE) return 0;

    pe32.dwSize = sizeof(PROCESSENTRY32);

    if (Process32First(process_snap, &pe32)) {
        std::string exeFileString = pe32.szExeFile;
        std::wstring exeFile = std::wstring(exeFileString.begin(), exeFileString.end());
        if (name.compare(exeFile) == 0) result = pe32.th32ProcessID;
        while (Process32Next(process_snap, &pe32)) {
            std::string exeFileString = pe32.szExeFile;
            std::wstring exeFile = std::wstring(exeFileString.begin(), exeFileString.end());
            if (name.compare(exeFile) == 0) result = pe32.th32ProcessID;
        }
    }

    CloseHandle(process_snap);

    std::cout << result << std::endl;

    return result;
}

using namespace std::chrono_literals;

bool is_injected(uint32_t pid) {
    HMODULE hMods[1024];
    HANDLE hProcess;
    DWORD cbNeeded;
    unsigned int i;
    hProcess = OpenProcess(PROCESS_QUERY_INFORMATION |
                               PROCESS_VM_READ,
                           FALSE, pid);

    if (NULL == hProcess)
        return false;

    if (EnumProcessModules(hProcess, hMods, sizeof(hMods), &cbNeeded)) {
        for (i = 0; i < (cbNeeded / sizeof(HMODULE)); i++) {
            TCHAR szModName[MAX_PATH];
            if (GetModuleBaseName(hProcess, hMods[i], szModName, sizeof(szModName) / sizeof(TCHAR))) {
                std::string modNameString = szModName;
                std::wstring modName = std::wstring(modNameString.begin(), modNameString.end());
                if (modName.compare(L"AyayaDLL.dll") == 0) {
                    CloseHandle(hProcess);
                    return true;
                }
            }
        }
    }

    CloseHandle(hProcess);

    return false;
}

void enable_debug_privilege() {
    HANDLE token;
    LUID value;
    TOKEN_PRIVILEGES tp;

    printf("enable_debug_privilege\n");

    if (OpenProcessToken(GetCurrentProcess(), TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, &token)) {
        printf("HANDLE: %x\n", token);

        if (LookupPrivilegeValue(NULL, SE_DEBUG_NAME, &value)) {
            printf("VALUE: %x\n", value);

            tp.PrivilegeCount = 1;
            tp.Privileges[0].Luid = value;
            tp.Privileges[0].Attributes = SE_PRIVILEGE_ENABLED;
            if (AdjustTokenPrivileges(token, FALSE, &tp, sizeof(tp), NULL, NULL))
                printf("OK\n");
            CloseHandle(token);
        }
    }
}

HANDLE inject(uint32_t pid, std::string dll_path) {
    auto handle = OpenProcess(PROCESS_ALL_ACCESS, false, pid);

    if (!handle || handle == INVALID_HANDLE_VALUE) {
        printf("[-] Failed to open process!\n");
        return NULL;
    }

    FILETIME ft;
    SYSTEMTIME st;
    GetSystemTime(&st);
    SystemTimeToFileTime(&st, &ft);

    FILETIME create, exit, kernel, user;
    GetProcessTimes(handle, &create, &exit, &kernel, &user);

    auto delta = 10 - static_cast<int32_t>((*reinterpret_cast<uint64_t *>(&ft) - *reinterpret_cast<uint64_t *>(&create.dwLowDateTime)) / 10000000U);
    if (delta > 0)
        std::this_thread::sleep_for(std::chrono::seconds(delta));

    char dllPathChars[MAX_PATH];
    DWORD r = GetFullPathNameA(dll_path.c_str(), MAX_PATH, dllPathChars, NULL);

    if (r == 0) {
        printf("GETTING LIB PATH FILENAME FAILED\n");
    } else if (r > MAX_PATH) {
        printf("BUFFER TOO SMALL\n");
    }

    LPVOID LoadLib = (LPVOID)GetProcAddress(GetModuleHandleW(L"kernel32.dll"), "LoadLibraryA");
    LPVOID remotePathSpace = VirtualAllocEx(handle, NULL, strlen(dllPathChars) + 1, MEM_RESERVE | MEM_COMMIT, PAGE_READWRITE);
    if (!remotePathSpace) {
        printf("[-] Failed to create virtual space!\n");
        CloseHandle(handle);
        return NULL;
    }

    if (!WriteProcessMemory(handle, remotePathSpace, dllPathChars, strlen(dllPathChars) + 1, NULL)) {
        printf("[-] Failed to write memory!\n");
        CloseHandle(handle);
        return NULL;
    }

    HANDLE remoteThread = CreateRemoteThread(handle, NULL, NULL, (LPTHREAD_START_ROUTINE)LoadLib, (LPVOID)remotePathSpace, NULL, NULL);

    if (remoteThread == NULL) {
        printf("[-] Failed to create thread!\n");
        VirtualFreeEx(handle, remotePathSpace, 0, MEM_RELEASE);
        CloseHandle(handle);
        return NULL;
    }

    // WaitForSingleObject(remoteThread, INFINITE);
    // CloseHandle(remoteThread);
    // VirtualFreeEx(handle, remotePathSpace, 0, MEM_RELEASE);
    // CloseHandle(handle);
    printf("[+] Injected successfully!\n");
    return remoteThread;
}

// ------------------------ API FUNCTIONS ---------------------------------------------

Napi::Value ApiInject(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();

    if (info.Length() != 2) {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    if (!info[0].IsString()) {
        Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
        return env.Null();
    }
    if (!info[1].IsString()) {
        Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string processName = info[0].As<Napi::String>().ToString();
    std::string dllPath = info[1].As<Napi::String>().ToString();

    std::wstring ProcessNameW = std::wstring(processName.begin(), processName.end());

    // INJECT
    enable_debug_privilege();

    std::cout << "PROCESS_NAME: " << processName << std::endl;
    std::cout << "DLL_PATH: " << dllPath << std::endl;

    auto process = find_process(ProcessNameW);

    if (!is_injected(process)) {  // AyayaDLL.dll
        std::this_thread::sleep_for(1s);
        HANDLE ret = inject(process, dllPath);
        Napi::Number result = Napi::Number::New(env, (double)((uint64_t)ret));
        return result;
    }

    Napi::Boolean result = Napi::Boolean::New(env, false);
    return result;
}

Napi::Value GetFunctionAddress(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();

    // if (info.Length() != 2) {
    //     Napi::TypeError::New(env, "Wrong number of arguments")
    //         .ThrowAsJavaScriptException();
    //     return env.Null();
    // }

    // if (!info[0].IsString()) {
    //     Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    //     return env.Null();
    // }
    // if (!info[1].IsString()) {
    //     Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    //     return env.Null();
    // }

    uint64_t hModuleNum = info[0].As<Napi::Number>().ToNumber().Int64Value();
    HMODULE hModule = (HMODULE)hModuleNum;

    std::string functionName = info[1].As<Napi::String>().ToString();
    LPCSTR lpProcName = (LPCSTR)functionName.c_str();

    printf("MODULE: %x\n", hModuleNum);
    std::cout << "FUNCTION: " << functionName << std::endl;

    FARPROC address = GetProcAddress(hModule, lpProcName);
    printf("ADDRESS: %x\n", address);

    Napi::Number result = Napi::Number::New(env, (double)((uint64_t)address));
    return result;
}

Napi::Value GetLeaguePid(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    
    uint32_t processId = find_process(L"League of Legends.exe");

    Napi::Number result = Napi::Number::New(env, (double)(processId));
    return result;
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "inject"), Napi::Function::New(env, ApiInject));
    exports.Set(Napi::String::New(env, "getFunctionAddress"), Napi::Function::New(env, GetFunctionAddress));
    exports.Set(Napi::String::New(env, "getLeaguePID"), Napi::Function::New(env, GetLeaguePid));
    return exports;
}

// ---------------------------------------------------------------------

NODE_API_MODULE(injector, Init)