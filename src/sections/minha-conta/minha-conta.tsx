import { Grid, Button, TextField, Typography } from "@mui/material"

import { DashboardContent } from "src/layouts/dashboard"

export function MinhaConta(){
    return (
        <DashboardContent>
            
            <Grid sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                alignItems: 'flex-start' 
            }}>
                <Typography variant="h4">Meus dados</Typography>
                <TextField
                    label="Email"
                    variant="outlined"   // "outlined" | "filled" | "standard"
                    fullWidth
                    value='jonascosta@gmail.com'
                />
                <TextField
                    label="Senha atual"
                    variant="outlined"   // "outlined" | "filled" | "standard"
                    fullWidth
                    type="password"
                    value="123456"
                />
                <TextField
                    label="Nova senha (deixe em branco para não alterar)"
                    variant="outlined"   // "outlined" | "filled" | "standard"
                    fullWidth
                    type="password"
                />
                <TextField
                    label="Confirmar nova senha"
                    variant="outlined"   // "outlined" | "filled" | "standard"
                    fullWidth
                    type="password"
                />
                <Button sx={{
                    backgroundColor: '#141556',
                    color: '#fff',
                    width: 200,
                    "&:hover": {
                        backgroundColor: '#00A9C4'
                    }
                }}>Salvar</Button>
            </Grid>
        </DashboardContent>
    )
}