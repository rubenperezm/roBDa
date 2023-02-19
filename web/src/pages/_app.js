import Head from 'next/head';
import { Provider } from 'react-redux';
import { useStore } from '../store';

const App = ({ Component, pageProps }) => {
    const store = useStore(pageProps.initialReduxState);

    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    );
};

export default App;
