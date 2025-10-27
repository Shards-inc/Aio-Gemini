import React from 'react';
import type { ConnectorStatus } from '../types/connectorTypes';
import { StatusConnectedIcon, StatusDisconnectedIcon, StatusErrorIcon, StatusPendingIcon } from './connectorIcons';

interface ConnectorStatusBadgeProps {
  status: ConnectorStatus;
  showIcon?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  connected: {
    icon: StatusConnectedIcon,
    text: 'Connected',
    bgColor: 'bg-emerald-500/20',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    dotColor: 'bg-emerald-400'
  },
  disconnected: {
    icon: StatusDisconnectedIcon,
    text: 'Disconnected',
    bgColor: 'bg-slate-500/20',
    textColor: 'text-slate-400',
    borderColor: 'border-slate-500/30',
    dotColor: 'bg-slate-400'
  },
  error: {
    icon: StatusErrorIcon,
    text: 'Error',
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    dotColor: 'bg-red-400'
  },
  pending: {
    icon: StatusPendingIcon,
    text: 'Pending',
    bgColor: 'bg-amber-500/20',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    dotColor: 'bg-amber-400'
  }
};

const sizeConfig = {
  sm: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    icon: 'h-3 w-3',
    dot: 'h-1.5 w-1.5'
  },
  md: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    icon: 'h-4 w-4',
    dot: 'h-2 w-2'
  },
  lg: {
    padding: 'px-4 py-2',
    text: 'text-base',
    icon: 'h-5 w-5',
    dot: 'h-2.5 w-2.5'
  }
};

export const ConnectorStatusBadge: React.FC<ConnectorStatusBadgeProps> = ({
  status,
  showIcon = true,
  showText = true,
  size = 'md'
}) => {
  const config = statusConfig[status];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full border font-medium
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${sizes.padding} ${sizes.text}
      `}
    >
      {showIcon && (
        <div className="relative">
          <Icon className={sizes.icon} />
          {status === 'pending' && (
            <div className={`absolute inset-0 ${sizes.icon} animate-ping`}>
              <Icon className="opacity-75" />
            </div>
          )}
        </div>
      )}
      {showText && <span>{config.text}</span>}
      {!showText && (
        <div className={`${sizes.dot} ${config.dotColor} rounded-full`} />
      )}
    </div>
  );
};

