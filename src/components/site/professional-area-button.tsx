"use client";

interface ProfessionalAreaButtonProps {
    primaryColor: string;
    loginUrl: string;
}

export function ProfessionalAreaButton({ primaryColor, loginUrl }: ProfessionalAreaButtonProps) {
    return (
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
            <p className="text-gray-500 text-sm mb-3">
                É o profissional deste site?
            </p>
            <a
                href={loginUrl}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{
                    border: `2px solid ${primaryColor}`,
                    color: primaryColor,
                    backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColor;
                    e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = primaryColor;
                }}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Área do Profissional
            </a>
        </div>
    );
}
