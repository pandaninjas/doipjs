import * as doip from '../src/index.js'

const main = async () => {
    // Fetch the key using HKP
    const key = await doip.keys.fetchHKP("test@doip.rocks")

    // Process it to extract the UIDs and their claims
    const obj = await doip.keys.process(key)

    // Process every claim for every user
    obj.users.forEach(async user => {
        user.claims.forEach(async claim => {
            // Match the claim
            await claim.match()

            // Verify the claim
            await claim.verify()
            console.log(claim)
        })
    })
}

main()