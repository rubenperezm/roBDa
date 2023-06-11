import cookie from 'cookie';
import { API_URL } from 'src/config';

export default async (req, res) => {
    if (req.method === 'PATCH') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;
        
        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para decidir sobre el duelo'
            });
        }

        const { id } = req.query;
        const { decision } = req.body;

        const body = JSON.stringify({
            decision
        });
        
        try {
            const apiRes = await fetch(`${API_URL}/partidas/partidas/duelo/decidir/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body
            });

            const data = await apiRes.json();
            if (apiRes.status === 200) {
                return res.status(200).json(data);
            } else {
                return res.status(apiRes.status).json(data);
            }
        } catch (err) {
            return res.status(500).json({
                error: err
            });
        }
    } else {
        res.setHeader('Allow', ['PATCH']);
        return res.status(405).json({
            error: `Método ${req.method} no permitido`
        });
    }
};
