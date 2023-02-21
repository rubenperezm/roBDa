import Head from 'next/head';

function PageLayout({ children, title = 'Robda'}) {

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <main>
                {children}
            </main>
        </>
            
    );
};

export default PageLayout;