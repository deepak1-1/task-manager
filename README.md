## Project Setup 
 - node version - 20.10.0
 - git clone https://github.com/deepak1-1/task-manager.git task-manager
 - copy below code inside `task-manager/client/.env`
   - ```
     REACT_APP_GOOGLE_CLIENT_ID=1039384096854-foabquvf8d2honkvsst57t8i518k7kun.apps.googleusercontent.com
     REACT_APP_GOOGLE_CLIENT_SECRET=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
     REACT_APP_SERVER_BASE_URL=http://localhost:4000/server
     ```
 - copy below code inside `task-manager/server/.env`
   - ```
      PORT=4000
      MONGO_DB_URI=mongodb+srv://root:XS4WQr3VtHlmy5Df@tasks-manager.iljns1m.mongodb.net/?retryWrites=true&w=majority&appName=tasks-manager
      ACCESS_TOKEN_SECRET=sVAtlWWRe^aECfxOm2ywC0E3-vv$bc@g
      ACCESS_TOKEN_EXPIRATION=1d
      COOKIE_EXPIRATION_DURATION=86400000
      GOOGLE_CLIENT_ID=1039384096854-foabquvf8d2honkvsst57t8i518k7kun.apps.googleusercontent.com
     ```  
 - `cd task-manager/server` - to move to server
 - `yarn` - to install dependencies
 - `yarn dev` - to start server
 - `cd ../client` - to move to frontend
 - `yarn` - to install dependencies
 - `yarn start` - to start server


Live Demo
```
http://3.108.64.222/
```

