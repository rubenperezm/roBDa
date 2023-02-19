import PageLayout from '../components/PageLayout';

const homePage = () => (
    <PageLayout
        title='httpOnly Auth | Home'
        content='Home page for this auth tutorial on httpOnly cookies with json web tokens'
    >
        <div className='p-5 bg-light rounded-3'>
            <div className='container-fluid py-3'>
                <h1 className='display-5 fw-bold'>Robda</h1>
                <p className='fs-4 mt-3'>
                    Robda es una plataforma de aprendizaje comunitaria de la Universidad de Cádiz basada en preguntas tipo test.
                </p>
            </div>
        </div>
    </PageLayout>
);

export default homePage;
