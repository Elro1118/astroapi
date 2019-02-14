let currentLaunchesUpComing = []
let numberLaunches = 0

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
      document.querySelector('.pictureDay').src = currentPicture.url
      document.querySelector('.pictureTitle').textContent =
        'Copyright: ' + currentPicture.copyright + ' | ' + currentPicture.title
    })
}

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
  document.querySelector('.dateLaunch').textContent =
    currentLaunchesUpComing[index].launch_date_utc
  document.querySelector('.site_name_long').textContent =
    currentLaunchesUpComing[index].launch_site.site_name_long
  let temp =
    currentLaunchesUpComing[index].details === null
      ? 'No description available yet.'
      : currentLaunchesUpComing[index].details
  document.querySelector('.details').textContent = temp
}

const main = () => {
  getPicture()
  getLaunchesUpComing()
}

document.addEventListener('DOMContentLoaded', main)
document.querySelector('.left-button').addEventListener('click', goLeftSide)
document.querySelector('.right-button').addEventListener('click', goRightSide)
