import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

type typePrograms = {
    id: number;
    imgBase64OrLink: string,
    title: string,
    linkDownload: string
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
  const [programas, setProgramas] = useState<any>([])
  useEffect(() => {
    const programasArr: typePrograms[] = [
      {id: 1, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
      {id: 2, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
      {id: 3, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
      {id: 4, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
      {id: 5, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
      {id: 6, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
      {id: 7, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
      {id: 8, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
      {id: 9, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
      {id: 10, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
      {id: 11, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
      {id: 12, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
      {id: 13, imgBase64OrLink: './adobe.png', title: 'After effects CC 2025', linkDownload: ''},
    ]

    setProgramas(programasArr)
  }, [])
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Meus Softwares
      </Typography>

      <Grid container spacing={3}>
        {programas.length === 0 && (<p>Você não comprou nenhum programa ainda. <a href="/programas">Comprar agora</a></p>)}
        {programas.map((programs: typePrograms) => (
              <Card variant="outlined" sx={{ p: 2 }} key={programs.id}>
                <CardMedia
                  component="img"
                  height="200"
                  image="./adobe.png"
                  alt="Descrição da imagem"
                />
                <Typography variant="h6">{programs.title}</Typography>
                
                <Link href={programs.linkDownload} target="_blank" underline="hover">
                  <Button variant="contained" sx={{ backgroundColor: "#141556", "&:hover": { backgroundColor: "#00A9C4" } }}>Baixar</Button>
                </Link>
              </Card>
            ))}
        
      </Grid>
    </DashboardContent>
  );
}
