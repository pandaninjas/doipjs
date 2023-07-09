import * as doip from '../src/index.js'

const main = async () => {
    // const sp = doip.ServiceProviderDefinitions.data['activitypub'].processURI('https://fosstodon.org/@yarmo')
    const sp = doip.ServiceProviderDefinitions.data['discourse'].processURI('https://domain.org/u/alice')
    console.log(sp);
}

main()