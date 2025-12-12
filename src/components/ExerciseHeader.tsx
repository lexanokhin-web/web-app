import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { ArrowLeft } from 'lucide-react';

interface ExerciseHeaderProps {
    title: string;
    subtitle?: string;
    backPath?: string;
    onBack?: () => void;
    rightContent?: React.ReactNode;
}

export const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
    title,
    subtitle,
    backPath,
    onBack,
    rightContent
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (backPath) {
            navigate(backPath);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <Button onClick={handleBack} variant="secondary">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Zurück
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-gray-600">{subtitle}</p>
                    )}
                </div>
            </div>
            {rightContent && (
                <div className="flex items-center gap-4">
                    {rightContent}
                </div>
            )}
        </div>
    );
};
