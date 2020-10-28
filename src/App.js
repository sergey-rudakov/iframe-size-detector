import {useEffect, useState, useRef} from 'react';
import './App.css';

function App() {
    const [src, setSrc] = useState('');
    const [height, setHeight] = useState(0);
    const [pending, setPending] = useState(false);
    const timer = useRef(null);
    const iframeContainerRef = useRef();

    const detectIframeHeight = async (src) => {
        return new Promise((resolve, reject) => {
            let h = 0;
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', src);
            iframe.setAttribute('id', 'iframeId');
            iframe.setAttribute('width', '100%');
            iframe.onload = () => {
                const interval = setInterval(() => {
                    console.log(iframe.contentWindow);
                    /*const doc = iframeCur.contentDocument?
                        iframeCur.contentDocument:
                        iframeCur.contentWindow.document;
                    console.log(doc);*/
                    const nh = document.getElementsByTagName('html')[0].scrollHeight;
                    console.log(nh, h);
                    h += 100;
                    if (h >= 800) {
                        clearInterval(interval);
                        resolve(h);
                    }
                }, 1000);
            }
            iframeContainerRef.current.innerHTML = '';
            iframeContainerRef.current.appendChild(iframe);
        });
    };

    useEffect(() => {
        if (src && !pending) {
            if (timer.current) {
                clearTimeout(timer.current);
            }
            timer.current = setTimeout(async () => {
                setPending(true);
                const height = await detectIframeHeight(src);
                setPending(false);
                setHeight(+height);
            }, 2000);
        }
    }, [src]);

    return (
        <div className='App'>
            <div className='App-container'>
                <h1>Iframe height detector</h1>
                <div className='form-container'>
                    <form className='form'>
                        <input type='text'
                               name='src'
                               placeholder='paste page url'
                               value={src}
                               onChange={(e) => setSrc(e.target.value)}
                               disabled={pending}/>
                        { pending && (<p>Pending...</p>) }
                        { (height > 0 && !pending ) && (<input type='number'
                                            name='src'
                                            placeholder=''
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}  />) }
                    </form>
                    <div className='iframe-wrapper'>
                        <div className='iframe-container' ref={iframeContainerRef}>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
