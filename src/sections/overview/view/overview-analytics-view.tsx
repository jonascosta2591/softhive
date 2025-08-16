import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';


// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Meus programas
      </Typography>

      <Grid container spacing={3}>
        <Card variant="outlined" sx={{ p: 2 }}>
          <CardMedia
            component="img"
            height="200"
            image="./adobe.png"
            alt="Descrição da imagem"
          />
          <Typography variant="h6">After effects CC 2025</Typography>
          <Button variant="contained">Baixar</Button>
        </Card>
      </Grid>
    </DashboardContent>
  );
}
