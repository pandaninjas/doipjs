const doip = require('../src')

const main = async () => {
    // Fetch the key using HKP
    const key = await doip.keys.fetchHKP("test@doip.rocks")

    // Process it to extract the UIDs and their claims
    const obj = await doip.keys.process(key)

    // Log the claims of the first UID
    console.log(obj.users[0].claims)
}

main()