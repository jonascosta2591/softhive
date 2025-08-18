import { useState, useEffect } from "react"

import { Grid, Card, Link, Button, CardMedia, TextField, Typography } from "@mui/material"

import { DashboardContent } from "src/layouts/dashboard"

type typePrograms = {
    id: number;
    imgBase64OrLink: string,
    title: string,
    price: string
}

export function Programas(){
    const [programas, setProgramas] = useState<typePrograms[]>([])
    useEffect(() => {
        const programasArr: typePrograms[] = [
            {id: 1, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
            {id: 2, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
            {id: 3, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
            {id: 4, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
            {id: 5, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
            {id: 6, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
            {id: 7, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
            {id: 8, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
            {id: 9, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
            {id: 10, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
            {id: 11, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
            {id: 12, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
            {id: 13, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
        ]
        setProgramas(programasArr)
    }, [])
    return (
        <DashboardContent maxWidth="xl">
        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
            Lista de Softwares
        </Typography>

        <Grid container spacing={3}>
            <TextField label="Pesquisar programa" type="Pesquisar programa" variant="outlined" fullWidth />
            <Button sx={{backgroundColor: '#141556', color: '#fff', marginBottom: 3}}>Pesquisar</Button>
        </Grid>

        <Grid container spacing={3}>

            {programas.map((programs, i) => (
                <Card variant="outlined" sx={{ p: 2 }} key={i}>
                    <CardMedia
                    component="img"
                    height="200"
                    image={programs.imgBase64OrLink}
                    alt="Descrição da imagem"
                    />
                    <Typography variant="h6">{programs.title}</Typography>
                    
                    <Link href={'http://localhost:3000/buy/' + programs.id} target="_blank" underline="hover">
                        <Button variant="contained" sx={{ backgroundColor: "#141556", "&:hover": { backgroundColor: "#00A9C4" } }}>Comprar por R$ {programs.price},00</Button>
                    </Link>
                </Card>
            ))}
            
        </Grid>
        </DashboardContent>
    )
}