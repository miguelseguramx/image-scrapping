const puppeteer = require('puppeteer')
const download = require('image-downloader')
const fs = require('fs')

async function searchImgUrls(URL) {
  // First we open a new browser with Puppeteer
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(URL)
  // Search all the Img tags and return the source of them
  const urls = await page.evaluate(() => {
    const $Imgs = [...document.querySelectorAll('img')]
    return $Imgs.map($Img =>  $Img.src)
  })
  await browser.close()
  return urls
}

async function downloadImages () {
  // FIrst, we retrieve the URL where we are going to start the images
  // We can inspect the args with:
  // console.log(process.argv)
  const URL = process.argv[2]

  //  We retrieve the route where we are going to dave all the images
  const PATH = process.argv[3]

  // It's really important to create the folder to export the images
  fs.mkdir(PATH, () => console.log(`${PATH} has been created`))

  const imageUrls = await searchImgUrls(URL)
  let counter = 0
  imageUrls.forEach(async url => {
    // Extract all the text after the last /
    const name = url.substr(url.lastIndexOf('/'))
    const options = {
      url,
      dest: `${PATH}/${name}`,
    }
    await download.image(options)
    counter += 1
    console.log(`Downloading ${counter} of ${imageUrls.length}`)
  })

  // process.exit()
}

downloadImages()
