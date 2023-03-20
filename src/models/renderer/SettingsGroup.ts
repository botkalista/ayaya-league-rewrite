

export type SettingType = 'input' | 'number' | 'text' | 'boolean' | 'select' | 'none' | 'button'

export type SettingNone = { text: string; type: 'none'; }

export type SettingText = { text: string; type: 'text'; value: string; }

export type SettingBoolean = { text: string; type: 'boolean'; value: boolean; }

export type SettingButton = { text: string; type: 'button'; click: () => any }

type SettingSelectType = { text: string, icon?: string, value: any }

export type SettingSelect<T extends SettingSelectType[] = SettingSelectType[]> = {
    text: string;
    type: 'select';
    options: T;
    value: T[number]['value']
}

export type SettingNumber = {
    text: string;
    type: 'number';
    value: number;
    min: number;
    max: number;
    step: number;
}

export type SettingInput = {
    text: string;
    type: 'input';
    value: string;
    multiLine: boolean;
}

export type Setting = SettingNone | SettingBoolean | SettingText | SettingNumber | SettingInput | SettingButton | SettingSelect<any>;