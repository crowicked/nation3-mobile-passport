import crypto, { Hash, Sign } from 'crypto'
import fs from 'fs'

export class AppleCryptoUtils {

    /**
     * Create a PKCS #7 detached signature for the manifest that uses the private key of the 
     * pass identifier signing certificate.
     */
    static createSignature(filePath : string) : string {
        console.log('createSignature')

        console.log(`filePath: "${filePath}"`)

        // // Create a signature for the file's content
        // const signature : Sign = crypto.createS

        // TODO
        return ''
    }

    /**
     * The manifest is a JSON object that contains a dictionary of the SHA1 hashes for each of 
     * the source files for the pass. The dictionary key is the pathname of the file relative 
     * to the top level of the pass, and the value is the SHA1 hash.
     * 
     * Example:
     * 
     * {
     *   "icon.png" : "2a1625e1e1b3b38573d086b5ec158f72f11283a0",
     *   "icon@2x.png" : "7321a3b7f47d1971910db486330c172a720c3e4b",
     *   "icon@3x.png" : "7321a3b7f47d1971910db486330c172a720c3e4b",
     *   "pass.json" : "ef3f648e787a16ac49fff2c0daa8615e1fa15df9",
     *   "strip.png" : "25b737727194b5c7b26a86d57e859a054eada240",
     *   "en.lproj\/logo.png" : "cff02680b9041b7bf637960f9f2384738c935347",
     *   "en.lproj\/logo@2x.png" : "0e12af882204c3661fd937f6594c6b5ffc6b8a49",
     *   "en.lproj\/logo@3x.png" : "1f103c8a07fb979ea33adfbfd031e26305fd616b",
     *   "en.lproj\/pass.strings" : "aaf7d9598f6a792755be71f492a3523d507bc212",
     *   "zh-Hans.lproj\/logo.png" : "eca86d8a474ccd33978f6aaf98a564669d45c7ae",
     *   "zh-Hans.lproj\/logo@2x.png" : "b6556bc2fa795d11262f17cdff04f80350398f5f",
     *   "zh-Hans.lproj\/logo@3x.png" : "124f8381721b44b2b57bf33e30b8a9a2e0404bce",
     *   "zh-Hans.lproj\/pass.strings" : "b0b4499ba7369e4cc15bad45c251e7b9bbcad6a4",
     * }
     */
    static generateManifestObject(templateVersion : number) : JSON {
        console.log('generateManifest')
        
        const manifest : any = {
            'icon.png': this.calculateSha1Hash(`../template-versions/apple/${templateVersion}/icon.png`),
            'icon@2x.png': this.calculateSha1Hash(`../template-versions/apple/${templateVersion}/icon@2x.png`),
            'logo.png': this.calculateSha1Hash(`../template-versions/apple/${templateVersion}/logo.png`),
            'logo@2x.png': this.calculateSha1Hash(`../template-versions/apple/${templateVersion}/logo@2x.png`),
            'pass.json': this.calculateSha1Hash(`../template-versions/apple/${templateVersion}/pass.json`),
            'strip.png': this.calculateSha1Hash(`../template-versions/apple/${templateVersion}/strip.png`),
        }
        
        return <JSON>manifest
    }

    /**
     * Calculates the SHA-1 hash of a file's content.
     */
    static calculateSha1Hash(filePath : string) : string {
        console.log('calculateSha1Hash')

        console.log(`filePath: "${filePath}"`)

        // Read the file content
        const fileBuffer : Buffer = fs.readFileSync(filePath)
        console.log('fileBuffer:', fileBuffer)

        // Create a SHA-1 hash
        const hash : Hash = crypto.createHash('sha1')
        console.log('hash:', hash)

        // Update the hash content with the Buffer data
        hash.update(fileBuffer)

        // Generate hash digest of all the data
        const hexDigest : string = hash.digest('hex')
        console.log('hexDigest:', hexDigest)

        return hexDigest
    }
}
