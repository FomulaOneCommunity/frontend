'use client';
import type { FC } from 'react';
import { useTranslations } from 'next-intl';

export type PasswordCriteria = Readonly<{
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
}>;

type PasswordRulesProps = Readonly<{
    criteria: PasswordCriteria;
}>;

const PasswordRules: FC<PasswordRulesProps> = ({ criteria }) => {
    const t = useTranslations('passwordRules');

    const rules: Array<{ key: keyof PasswordCriteria; text: string }> = [
        { key: 'length', text: t('length') },
        { key: 'uppercase', text: t('uppercase') },
        { key: 'lowercase', text: t('lowercase') },
        { key: 'number', text: t('number') },
        { key: 'special', text: t('special') },
    ];

    return (
        <ul className="mt-2 text-xs text-gray-500 list-disc list-inside">
            {rules.map(({ key, text }) => {
                const ok = criteria[key];
                return (
                    <li
                        key={key}
                        className={ok ? 'text-green-600 font-bold' : 'text-gray-500'}
                    >
                        {ok ? '✅' : '❌'} {text}
                    </li>
                );
            })}
        </ul>
    );
};

export default PasswordRules;