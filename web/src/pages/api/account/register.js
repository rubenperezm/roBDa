import { API_URL } from '../../../config/index';

export default async (req, res) => {
    if (req.method === 'POST') {
        const {
            email,
            username,
            password,
            password2
        } = req.body;

        const body = JSON.stringify({
            email,
            username,
            password,
            password2
        });

        try {
            const apiRes = await fetch(`${API_URL}/register/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: body
            });

            const data = await apiRes.json();

            if (apiRes.status === 201) {
                return res.status(201).json({ success: data.success });
            } else {
                const flattenedResults = {};
                Object.keys(data).forEach((key) => {
                    flattenedResults[key] = data[key][0];
                });

                return res.status(apiRes.status).json({
                    error: flattenedResults
                });
            }
        } catch(err) {
            return res.status(500).json({
                error: 'Algo salió mal al registrar el usuario'
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ 'error': `Método ${req.method} no permitido`});
    }
};
