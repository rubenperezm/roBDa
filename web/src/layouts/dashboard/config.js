import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon'; // Dejarla porque se necesita para las stats
import StarIcon from '@heroicons/react/24/solid/StarIcon';
import TrophyIcon from '@heroicons/react/24/solid/TrophyIcon';
import QuestionMarkCircleIcon from '@heroicons/react/24/solid/QuestionMarkCircleIcon';
import HomeIcon from '@heroicons/react/24/solid/HomeIcon';
import QueueListIcon from '@heroicons/react/24/solid/QueueListIcon';
import BoltIcon from '@heroicons/react/24/solid/BoltIcon';
import { SvgIcon } from '@mui/material';

export const studentItems = [
  {
    title: 'Menú Principal',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <HomeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Repasar',
    path: '/study',
    icon: (
      <SvgIcon fontSize="small">
        <StarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Competiciones',
    path: '/competitions',
    icon: (
      <SvgIcon fontSize="small">
        <TrophyIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Duelos',
    path: '/battles',
    icon: (
      <SvgIcon fontSize="small">
        <BoltIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Acerca de',
    path: '/about',
    icon: (
      <SvgIcon fontSize="small">
        <QuestionMarkCircleIcon />
      </SvgIcon>
    )
  },
];

export const adminItems = [
  {
    title: 'Menú Principal',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <HomeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Preguntas',
    path: '/admin/questions',
    icon: (
      <SvgIcon fontSize="small">
        <QueueListIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Competiciones',
    path: '/admin/competitions',
    icon: (
      <SvgIcon fontSize="small">
        <TrophyIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Estadísticas',
    path: '/admin/stats',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Acerca de',
    path: '/about',
    icon: (
      <SvgIcon fontSize="small">
        <QuestionMarkCircleIcon />
      </SvgIcon>
    )
  },
];
