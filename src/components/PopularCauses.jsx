import { Container, Typography, Grid, Card, CardContent, Button, Box } from '@mui/material';
import NatureIcon from '@mui/icons-material/Nature';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';

const causes = [
  {
    title: 'Навколишнє середовище',
    description: "Допоможіть зберегти та захистити ресурси нашої планети.",
    icon: <NatureIcon sx={{ fontSize: 50, color: 'rgba(96,98,10,1)' }} />,
  },
  {
    title: 'Освіта',
    description: 'Підтримуйте навчальні ініціативи та наставляйте студентів.',
    icon: <SchoolIcon sx={{ fontSize: 50, color: 'rgba(96,98,10,1)' }} />,
  },
  {
    title: 'Для молоді',
    description: 'Програми підтримки дітей та молоді.',
    icon: <GroupIcon sx={{ fontSize: 50, color: 'rgba(96,98,10,1)' }} />,
  },
];

function PopularCauses() {
  return (
    <Box sx={{ backgroundColor: '#f6f6eb', py: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 6, fontWeight: 'bold', color: 'rgba(7,33,0,1)' }}
        >
          Популярні категорії
        </Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center" 
        >
          {causes.map((cause) => (
            <Grid
              item
              key={cause.title}
              xs={12}
              sm={6}
              md={4}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Card
                sx={{
                  width: 280, 
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 300,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  {cause.icon}
                  <Typography
                    variant="h6"
                    sx={{ mt: 2, mb: 2, fontWeight: 'bold', color: 'rgba(7,33,0,1)' }}
                  >
                    {cause.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 4, color: 'rgba(7,33,0,0.8)' }}
                  >
                    {cause.description}
                  </Typography>
                </CardContent>
                <Button
                  fullWidth
                  variant="text"
                  sx={{
                    color: 'rgba(96,98,10,1)',
                    fontWeight: 'bold',
                    textTransform: 'none',
                  }}
                >
                  Переглянути можливості
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default PopularCauses;
