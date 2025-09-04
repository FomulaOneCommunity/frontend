import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AuthProvider } from "@/context/AuthProvider";
import Header from "@/components/navbar/Header";
import FooterOnHome from "@/components/footer/FooterOnHome";

type Params = Promise<Readonly<{ readonly locale: string }>>;

export async function generateMetadata(
    { params }: Readonly<{ readonly params: Params }>
): Promise<Metadata> { // ✅ 반환 타입 지정
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) notFound();

    const messages = await getMessages();
    const metadata = messages.metadata as {
        title: { template: string; default: string };
        description: string;
    };

    return {
        title: {
            template: metadata.title.template,
            default: metadata.title.default,
        },
        description: metadata.description,
    };
}

type LocaleLayoutProps = Readonly<{
    readonly children: ReactNode;
    readonly params: Params;
}>;

export default async function LocaleLayout({
                                               children,
                                               params,
                                           }: LocaleLayoutProps) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) notFound();

    const messages = await getMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
                <Header />
                <main className="flex-1 overflow-y-auto">{children}</main>
                <FooterOnHome />
            </AuthProvider>
        </NextIntlClientProvider>
    );
}