import { NextApiRequest, NextApiResponse } from "next"
import { ApplePass, Platform } from "../../interfaces"
import { Passes } from "../../utils/Passes"
const Web3 = require('web3')
import fs from 'fs'
import PassportIssuer from '../../abis/PassportIssuer.json'

// req = HTTP incoming message, res = HTTP server response
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('/api/downloadPass')

    try {
        const { address } = req.query
        console.log(`address: "${address}"`)

        // Instantiate a Web3 object
        const infuraEndpointURI = `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_ENDPOINT}`
        console.log('infuraEndpointURI:', infuraEndpointURI)
        const web3 = new Web3(infuraEndpointURI || "ws://localhost:8546");

        // Check that the address is valid
        if (!web3.utils.isAddress(address)) {
            console.error('Invalid address:', address)
            throw new Error('Invalid address')
        }

        const { signature } = req.query
        console.log(`signature: "${signature}"`)

        // Check that the signature is valid
        const signedMessage = 'I am the holder of this Nation3 passport'
        let recoveredAddress = undefined
        try {
            recoveredAddress = web3.eth.accounts.recover(signedMessage, signature);
        } catch (error: any) {
            console.error('Invalid signature:\n', error)
            throw new Error('Invalid signature', error)
        }
        console.log(`recoveredAddress: "${recoveredAddress}"`)
        if (address != recoveredAddress) {
            console.error('Invalid signature (address not recovered)')
            throw new Error('Invalid signature (address not recovered)')
        }

        const { platform } = req.query
        console.log(`platform: "${platform}"`)

        // Check that the platform is valid
        // TODO

        // Check that the address has a passport NFT
        const PassportIssuerContract = new web3.eth.Contract(PassportIssuer.abi, '0x279c0b6bfCBBA977eaF4ad1B2FFe3C208aa068aC')
        PassportIssuerContract.methods.passportId(address).call()
                .then((result: any) => {
                    console.log('passportIdPromise then result:', result)

                    const passportID : string = result
                    console.log('passportID:', passportID)

                    // Lookup ENS name
                    // TODO

                    // Populate the pass template
                    const filePath : string = Passes.downloadPass(Platform.Apple, passportID, address)
                    console.log('filePath:', filePath)

                    // Serve the pass download to the user
                    const fileName = `passport_${address}.pkpass`
                    console.log('fileName:', fileName)
                    res.setHeader('Content-Disposition', `attachment;filename=${fileName}`)
                    res.setHeader('Content-Type', 'application/vnd.apple.pkpass')
                    res.setHeader('Content-Length', fs.statSync(filePath).size)
                    const readStream = fs.createReadStream(filePath)
                    readStream.pipe(res)
                })
                .catch((error: any) => {
                    console.error('passportIdPromise catch error:\n', error)
                    res.status(400).json({
                        error: 'Passport ID not found for address'
                    })
                    return
                })
    } catch (err: any) {
        console.error('/api/downloadPass err:\n', err)
        res.status(400).json({
            error: err.message
        })
    }
}
