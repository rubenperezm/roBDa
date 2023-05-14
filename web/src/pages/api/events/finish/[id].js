import cookie from 'cookie';
import { API_URL } from 'src/config';

export default async (req, res) => {
    if (req.method === 'PUT') {
        const cookies = cookie.parse(req.headers.cookie ?? '');
        const access = cookies.access ?? false;

        

        if (access === false) {
            return res.status(401).json({
                error: 'Usuario no autorizado para terminar eventos'
            });
        }

        const { id } = req.query;
        try {
            const apiRes = await fetch(`${API_URL}/eventos/terminar/${id}/`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await apiRes.json();

            if (apiRes.status === 200) {
                return res.status(200).json(data);
            } else {
                return res.status(apiRes.status).json({
                    error: data
                });
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                error: err
            });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).json({
            error: `Método ${req.method} no permitido`
        });
    }
};
