let currentLaunchesUpComing = []
let numberLaunches = 0
let prevNowDate = null

const getLaunchesUpComing = () => {
  currentLaunchesUpComing = []
  fetch('https://sdg-astro-api.herokuapp.com/api/SpaceX/launches/upcoming')
    .then(resp => {
      return resp.json()
    })
    .then(launchesUpComing => {
      currentLaunchesUpComing = launchesUpComing
      numberLaunches = currentLaunchesUpComing.length - 1
      displayLaunch(0)
    })
}

const getPicture = () => {
  let currentPicture = {}
  fetch('https://sdg-astro-api.herokuapp.com/api/Nasa/apod')
    // getting the response back
    .then(resp => {
      return resp.json()
    })
    // opening the response
    .then(pictureDay => {
      currentPicture = pictureDay
      document.getElementById('pictureDay').style.backgroundImage = `url(${
        currentPicture.url
      })`
      let temp =
        currentPicture.copyright === null
          ? 'no copyright'
          : currentPicture.copyright
      document.querySelector('.pictureTitle').textContent =
        'Copyright: ' + temp + ' | ' + currentPicture.title
    })
}

const goLeftSide = () => {
  if (numberLaunches > -1) {
    displayLaunch(numberLaunches)
  } else {
    numberLaunches = currentLaunchesUpComing.length - 1
    displayLaunch(numberLaunches)
  }
  numberLaunches--
}

const goRightSide = () => {
  if (numberLaunches <= currentLaunchesUpComing.length - 1) {
    displayLaunch(numberLaunches)
  } else {
    numberLaunches = 0
    displayLaunch(numberLaunches)
  }
  numberLaunches++
}

const displayLaunch = index => {
  document.querySelector('.articleTitle').textContent =
    currentLaunchesUpComing[index].mission_name
  // document.querySelector('.dateLaunch').textContent =
  getCountDownDate(currentLaunchesUpComing[index].launch_date_utc)
  document.querySelector('.site_name_long').textContent =
    currentLaunchesUpComing[index].launch_site.site_name_long
  let temp =
    currentLaunchesUpComing[index].details === null
      ? 'No description available yet.'
      : currentLaunchesUpComing[index].details
  document.querySelector('.details').textContent = temp
}

const getCountDownDate = myDate => {
  if (prevNowDate) {
    clearInterval(prevNowDate)
  }

  let countDownDate = new Date(myDate).getTime()

  // Update the count down every 1 second

  prevNowDate = setInterval(() => {
    // Get todays date and time
    let now = new Date().getTime()

    // Find the distance between now and the count down date
    let distance = countDownDate - now

    // Time calculations for days, hours, minutes and seconds
    let days = Math.floor(distance / (1000 * 60 * 60 * 24))
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )

    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

    let seconds = Math.floor((distance % (1000 * 60)) / 1000)

    // Output the result in an element with id="demo"
    // document.getElementById('demo').innerHTML =
    document.querySelector('.dateLaunch').textContent =
      days +
      ' day ' +
      hours +
      ' hours ' +
      minutes +
      ' minutes ' +
      seconds +
      ' seconds '

    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(prevNowDate)
      // document.getElementById('demo').innerHTML = 'EXPIRED'
      document.querySelector('.dateLaunch').textContent = 'EXPIRED'
    }
    console.log(distance)
  }, 1000)
}

const main = () => {
  getPicture()
  getLaunchesUpComing()
}

document.addEventListener('DOMContentLoaded', main)
document.querySelector('.left-button').addEventListener('click', goLeftSide)
document.querySelector('.right-button').addEventListener('click', goRightSide)
