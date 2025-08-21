import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Typography,
    Box,
    IconButton,
} from '@mui/material';
import type { ButtonProps } from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';


type Severity = 'success' | 'error' | 'warning' | 'info';

type Action = {
    label: string;
    onClick?: () => void;
    variant?: 'text' | 'outlined' | 'contained';
    color?: ButtonProps['color'];
};

type StatusDialogProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    message: React.ReactNode;
    severity?: Severity;
    primaryAction?: Action;
    secondaryAction?: Action;
    iconOverride?: React.ComponentProps<typeof Iconify>['icon'];
};

type IconType = React.ComponentProps<typeof Iconify>['icon'];

const BRAND = {
    primary: '#00A9C4', // cyan
    navy: '#001F3F',    // dark blue
    navy2: '#002f5eff', 
    white: '#FFFFFF',
};

// Ícones por severidade (mantém semáforo por ícone, mas toda a UI usa as cores da marca)
const META: Record<Severity, { icon: IconType; defaultTitle: string }> = {
    success: { icon: 'solar:check-circle-bold' as IconType, defaultTitle: 'Tudo certo!' },
    error: { icon: 'solar:danger-triangle-bold' as IconType, defaultTitle: 'Algo deu errado' },
    warning: { icon: 'solar:warning-circle-bold' as IconType, defaultTitle: 'Atenção' },
    info: { icon: 'solar:info-circle-bold' as IconType, defaultTitle: 'Informação' },
};

export function StatusDialog({
    open,
    onClose,
    title,
    message,
    severity = 'info',
    primaryAction,
    secondaryAction,
    iconOverride,
}: StatusDialogProps) {
    const meta = META[severity];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: `1px solid ${alpha(BRAND.navy, 0.18)}`,
                    boxShadow: `0 20px 60px ${alpha('#000', 0.25)}`,
                },
            }}
        >
            {/* HEADER com gradiente da marca */}
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    bgcolor: BRAND.navy,
                    background: `linear-gradient(90deg, ${BRAND.navy} 0%, ${BRAND.navy2} 100%)`,
                    color: BRAND.white,
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: BRAND.white,
                            color: BRAND.navy,
                            display: 'grid',
                            placeItems: 'center',
                            boxShadow: `0 6px 16px ${alpha(BRAND.navy, 0.25)}`,
                            flexShrink: 0,
                        }}
                    >
                        <Iconify icon={iconOverride || meta.icon} width={22} height={22} />
                    </Box>

                    <DialogTitle
                        sx={{
                            p: 0,
                            m: 0,
                            color: BRAND.white,
                            typography: 'h6',
                            flex: 1,
                            lineHeight: 1.2,
                        }}
                    >
                        {title || meta.defaultTitle}
                    </DialogTitle>

                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{
                            color: BRAND.white,
                            '&:hover': { bgcolor: alpha(BRAND.white, 0.12) },
                        }}
                        aria-label="Fechar"
                    >
                        <CloseRoundedIcon fontSize="small" />
                    </IconButton>

                </Stack>
            </Box>

            {/* CONTEÚDO */}
            <DialogContent sx={{ pt: 2.5, pb: 0, px: 3 }}>
                {typeof message === 'string' ? (
                    <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {message}
                    </Typography>
                ) : (
                    message
                )}
            </DialogContent>

            {/* AÇÕES com botões no padrão da marca */}
            <DialogActions
                sx={{
                    px: 3,
                    py: 2.25,
                    gap: 1,
                    flexWrap: 'wrap',
                }}
            >
                {secondaryAction && (
                    <Button
                        onClick={secondaryAction.onClick}
                        variant={secondaryAction.variant || 'outlined'}
                        color={secondaryAction.color || 'inherit'}
                        sx={{
                            borderColor: BRAND.navy,
                            color: BRAND.navy,
                            '&:hover': {
                                borderColor: BRAND.navy,
                                bgcolor: alpha(BRAND.navy, 0.06),
                            },
                        }}
                    >
                        {secondaryAction.label}
                    </Button>
                )}

                <Button
                    onClick={primaryAction?.onClick || onClose}
                    variant={primaryAction?.variant || 'contained'}
                    color={primaryAction?.color || 'inherit'}
                    sx={{
                        ml: 'auto',
                        bgcolor: BRAND.primary,
                        color: BRAND.white,
                        '&:hover': { bgcolor: BRAND.navy },
                    }}
                >
                    {primaryAction?.label || 'OK'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
