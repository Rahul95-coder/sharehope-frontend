import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
export const CountdownTimer = ({ targetDate, onExpire, className = '', showIcon = true, }) => {
    const calculateTimeLeft = () => {
        const difference = new Date(targetDate).getTime() - new Date().getTime();
        if (difference <= 0) {
            return { total: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
        }
        return {
            total: difference,
            hours: Math.floor(difference / (1000 * 60 * 60)),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            isExpired: false,
        };
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
    useEffect(() => {
        const timer = setInterval(() => {
            const updated = calculateTimeLeft();
            setTimeLeft(updated);
            if (updated.isExpired) {
                clearInterval(timer);
                if (onExpire)
                    onExpire();
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate, onExpire]);
    if (timeLeft.isExpired) {
        return (<span className={`inline-flex items-center gap-1 font-semibold text-rose-600 text-xs ${className}`}>
        {showIcon && <Clock className="w-3.5 h-3.5"/>}
        Expired
      </span>);
    }
    const isCritical = timeLeft.total < 2 * 60 * 60 * 1000; // < 2 hours
    const isUrgent = timeLeft.total < 6 * 60 * 60 * 1000; // < 6 hours
    const colorClass = isCritical
        ? 'text-rose-600 font-bold animate-pulse'
        : isUrgent
            ? 'text-amber-600 font-semibold'
            : 'text-slate-600';
    const formatUnit = (val) => String(val).padStart(2, '0');
    return (<span className={`inline-flex items-center gap-1.5 text-xs ${colorClass} ${className}`}>
      {showIcon && <Clock className="w-3.5 h-3.5"/>}
      <span>
        {timeLeft.hours > 0 ? `${timeLeft.hours}h ` : ''}
        {formatUnit(timeLeft.minutes)}m {formatUnit(timeLeft.seconds)}s left
      </span>
    </span>);
};
