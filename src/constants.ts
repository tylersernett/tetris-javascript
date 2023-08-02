const prod = {  
    url: {
        BASE_URL: 'https://tylersernett.github.io/tetris-javascript/',
        API_URL: 'https://tetris-javascript.onrender.com',
    }
};

const dev = { 
    url: {
        BASE_URL: 'http://localhost:8080/dist',
        API_URL: 'http://localhost:8081',
    }
};

export const config = (process.env.NODE_ENV === 'development') ? dev : prod;