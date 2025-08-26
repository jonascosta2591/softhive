import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';
import axios from 'axios'

import { DashboardContent } from 'src/layouts/dashboard';

type typePrograms = {
    idsoftwares_para_comprar: number;
    link_drive: string;
    nome_software: string;
    imagem: string;
    price: string;
    category: string;
    description: string;
}
// ----------------------------------------------------------------------


export function OverviewAnalyticsView() {

  useEffect(() => {
    const token = localStorage.getItem('token')

    if(!token){
      window.location.href = "./sign-in"
    }
  }, [])

  useEffect(() => {
    const softwareEscolhido = localStorage.getItem('softwareEscolhido')
    if(softwareEscolhido){
      window.location.href = `./pagamento?id=${softwareEscolhido}`
    }
  })
  const [programas, setProgramas] = useState<typePrograms[]>([])
  useEffect(() => {
    // const programasArr: typePrograms[] = [
    //   {id: 1, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
    //   {id: 2, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
    //   {id: 3, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
    //   {id: 4, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
    //   {id: 5, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
    //   {id: 6, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
    //   {id: 7, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
    //   {id: 8, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
    //   {id: 9, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
    //   {id: 10, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
    //   {id: 11, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
    //   {id: 12, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
    //   {id: 13, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
    // ]

    const token = localStorage.getItem('token')

    axios.get(`${import.meta.env.VITE_API_URL}/my-softwares/my-softwares`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      setProgramas(response.data)
    }).catch((err) => {
      console.log(err)
      alert('Ocorreu um erro na comunicação com servidor, por favor atualize a página')
    })

    
  }, [])
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Meus Softwares
      </Typography>

      <Grid container spacing={3}>
        <Typography>Compre softwares <Link href="./softwares">aqui!</Link></Typography>
        {programas.map((programs: typePrograms) => (
              <Card variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} key={programs.idsoftwares_para_comprar}>
                <CardMedia
                  component="img"
                  sx={{
                      width: '205px',
                      height: '200px'
                  }}
                  image={programs.imagem}
                  alt={programs.description}
                />
                <Typography variant="h6" sx={{width: '200px', height: '60px', textAlign: 'center'}}>{programs.nome_software}</Typography>
                
                <Link href={programs.link_drive} target="_blank" underline="hover">
                  <Button variant="contained" sx={{ backgroundColor: "#141556", "&:hover": { backgroundColor: "#00A9C4" } }}>Baixar</Button>
                </Link>
              </Card>
            ))}
        
      </Grid>
    </DashboardContent>
  );
}
