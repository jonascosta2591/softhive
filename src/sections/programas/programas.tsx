import { useState, useEffect } from "react"

import { Grid, Card, Link, Button, CardMedia, TextField, Typography } from "@mui/material"

import { DashboardContent } from "src/layouts/dashboard"
import axios from 'axios'

type typePrograms = {
    id: number;
    name: string;
    image: string;
    price: string;
    category: string;
    description: string;
}

export function Programas(){

    useEffect(() => {
        const token = localStorage.getItem('token')

        if(!token){
            window.location.href = "./sign-in"
        }
    }, [])

    const [programas, setProgramas] = useState<typePrograms[]>([])
    useEffect(() => {
        // const programasArr: typePrograms[] = [
        //     {id: 1, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
        //     {id: 2, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
        //     {id: 3, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
        //     {id: 4, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
        //     {id: 5, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
        //     {id: 6, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
        //     {id: 7, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
        //     {id: 8, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
        //     {id: 9, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
        //     {id: 10, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
        //     {id: 11, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
        //     {id: 12, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
        //     {id: 13, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', price: '20'},
        // ]

        axios.get(`${import.meta.env.VITE_API_URL}/softwares/softwares`).then((response) => {
            setProgramas(response.data)
        }).catch((err) => {
            console.log(err)
            alert('Ocorreu um erro na comunicação com servidor, por favor reinicie a página!')
        })
        
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
            {programas.length === 0 && (<p>Carregando softwares...</p>)}
            {programas.map((programs, i) => (
                <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} key={i}>
                    <CardMedia
                    component="img"
                    sx={{
                        width: '205px',
                        height: '200px'
                    }}
                    image={programs.image}
                    alt={programs.description}
                    />
                    <Typography variant="h6" sx={{width: '200px', height: '60px', textAlign: 'center'}}>{programs.name}</Typography>
                    
                    <Link href={'./pagamento?id=' + programs.id} target="_blank" underline="hover">
                        <Button variant="contained" sx={{ backgroundColor: "#141556", "&:hover": { backgroundColor: "#00A9C4" } }}>Comprar por R$ {programs.price}</Button>
                    </Link>
                </Card>
            ))}
            
        </Grid>
        </DashboardContent>
    )
}