/*
Copyright 2021 Yarmo Mackenbach

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
Copyright 2020 Yarmo Mackenbach

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.set('port', process.env.PORT || 3000)

app.use('/api/1', require('./api/v1/'))
app.use('/api/2', require('./api/v2/'))

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Available endpoints: /api' })
})
app.get('/api', (req, res) => {
  return res
    .status(200)
    .json({ message: 'Available API versions: /api/1, /api/2' })
})
app.all('*', (req, res) => {
  return res.status(404).json({ message: 'API endpoint not found' })
})

app.listen(app.get('port'), () => {
  console.log(`Node server listening at http://localhost:${app.get('port')}`)
})
