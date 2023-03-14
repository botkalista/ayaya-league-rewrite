

export type SettingType = 'input' | 'number' | 'text' | 'boolean' | 'none' | 'button'

export type SettingNone = { id: string; text: string; type: 'none'; }

export type SettingText = { id: string; text: string; type: 'text'; value: string; }

export type SettingBoolean = { id: string; text: string; type: 'boolean'; value: boolean; }

export type SettingButton = { id: string; text: string; type: 'button'; }


export type SettingNumber = {
    id: string;
    text: string;
    type: 'number';
    value: number;
    min: number;
    max: number;
    step: number;
}

export type SettingInput = {
    id: string;
    text: string;
    type: 'input';
    value: string;
    multiLine: boolean;
}

export type Setting = SettingNone | SettingBoolean | SettingText | SettingNumber | SettingInput | SettingButton;

export type SettingsGroup = {
    id: string;
    title: string;
    settings: Setting[];
    description?: string;
}