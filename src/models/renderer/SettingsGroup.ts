

export type SettingType = 'input' | 'number' | 'text' | 'boolean' | 'none'

export type SettingNone = { text: string; type: 'none'; }

export type SettingText = { text: string; type: 'text'; value: string; }

export type SettingBoolean = { text: string; type: 'boolean'; value: boolean; }


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

export type Setting = SettingNone | SettingBoolean | SettingText | SettingNumber | SettingInput;

export type SettingsGroup = {
    title: string;
    settings: Setting[];
    description?: string;
}