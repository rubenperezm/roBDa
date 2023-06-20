import { useEffect, useState } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import { withAuthorization } from 'src/hocs/with-authorization';

import { Layout as StatsLayout } from 'src/layouts/stats/layout';
import { GeneralStats } from 'src/sections/admin/stats/general-stats';


const Page = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const getStats = async () => {
            const res = await axiosAuth.get('/api/stats').then(res => res.data);
            setStats(res);
        };
        getStats();
    }, []);

    return (
        <StatsLayout
            title="Estadísticas"
        >
            <GeneralStats stats={stats}/>
        </StatsLayout>
    );
};


export default withAuthorization(Page, true);

