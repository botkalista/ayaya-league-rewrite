

export type SettingType = 'input' | 'number' | 'text' | 'boolean' | 'select' | 'none' | 'button'

export type SettingNone = { id: string; text: string; type: 'none'; }

export type SettingText = { id: string; text: string; type: 'text'; value: string; }

export type SettingBoolean = { id: string; text: string; type: 'boolean'; value: boolean; }

export type SettingButton = { id: string; text: string; type: 'button'; click: () => any }

type SettingSelectType = { text: string, icon?: string, value: any }

export type SettingSelect<T extends SettingSelectType[] = SettingSelectType[]> = {
    id: string;
    text: string;
    type: 'select';
    options: T;
    value: T[number]['value']
}

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

export type Setting = SettingNone | SettingBoolean | SettingText | SettingNumber | SettingInput | SettingButton | SettingSelect<any>;

export type SettingsGroup = {
    id: string;
    title: string;
    settings: Setting[];
    description?: string;
}