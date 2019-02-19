let indexLaunch = 0
let prevNowDate = null

class MyLaunches {
  constructor() {
    this.currentLaunchesUpComing = []
  }

  getTotalDays(index) {
    let dateNow = new Date()
    let DateFuture = new Date(
      this.currentLaunchesUpComing[index].launch_date_utc
    )
    return Math.abs(DateFuture - dateNow)
  }

  getDetailLaunch(index) {
    return this.currentLaunchesUpComing[index].details === null
      ? 'No description available yet.'
      : this.currentLaunchesUpComing[index].details
  }

  getSiteNameLaunch(index) {
    return this.currentLaunchesUpComing[index].launch_site.site_name_long
  }

  getMissionName(index) {
    return this.currentLaunchesUpComing[index].mission_name
  }
}

class MyPicture {
  constructor() {
    this.currentPicture = {}
  }

  getCopyRight() {
    return this.currentPicture.copyright === null
      ? 'Copyright: no copyright'
      : 'Copyright: ' + this.currentPicture.copyright
  }
  getTitle() {
    return this.currentPicture.title === null
      ? ' | Title: no title'
      : ' | Title: ' + this.currentPicture.title
  }
}

const MY_LAUNCHES_LIST = new MyLaunches()
const MY_PICTURE_DAY = new MyPicture()

const getLaunchesUpComing = () => {
  fetch('https://sdg-astro-api.herokuapp.com/api/SpaceX/launches/upcoming')
    .then(resp => {
      return resp.json()
    })
    .then(launchesUpComing => {
      MY_LAUNCHES_LIST.currentLaunchesUpComing = launchesUpComing

      displayLaunch(indexLaunch)
    })
}

const getPicture = () => {
  // let currentPicture = {}
  fetch('https://sdg-astro-api.herokuapp.com/api/Nasa/apod')
    // getting the response back
    .then(resp => {
      return resp.json()
    })
    // opening the response
    .then(pictureDay => {
      MY_PICTURE_DAY.currentPicture = pictureDay
      displayPictureDay()
    })
}

const displayPictureDay = () => {
  document.getElementById('pictureDay').style.backgroundImage = `url(${
    MY_PICTURE_DAY.currentPicture.url
  })`

  document.querySelector('.pictureTitle').textContent =
    MY_PICTURE_DAY.getCopyRight() + MY_PICTURE_DAY.getTitle()
}

const goLeftSide = () => {
  indexLaunch--
  if (indexLaunch > -1) {
    displayLaunch(indexLaunch)
  } else {
    indexLaunch = MY_LAUNCHES_LIST.currentLaunchesUpComing.length - 1
    indexLaunch--
    displayLaunch(indexLaunch)
  }
}

const goRightSide = () => {
  indexLaunch++
  if (indexLaunch <= MY_LAUNCHES_LIST.currentLaunchesUpComing.length - 1) {
    displayLaunch(indexLaunch)
  } else {
    indexLaunch = 0
    displayLaunch(indexLaunch)
  }
}

const displayLaunch = index => {
  document.querySelector(
    '.articleTitle'
  ).textContent = MY_LAUNCHES_LIST.getMissionName(index)
  getTimeLaunch(MY_LAUNCHES_LIST.getTotalDays(index))
  document.querySelector(
    '.site_name_long'
  ).textContent = MY_LAUNCHES_LIST.getSiteNameLaunch(index)
  document.querySelector(
    '.details'
  ).textContent = MY_LAUNCHES_LIST.getDetailLaunch(index)
}

const getTimeLaunch = myDifferentDate => {
  let days = Math.floor(myDifferentDate / (1000 * 60 * 60 * 24))
  let hours = Math.floor(
    (myDifferentDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  let minutes = Math.floor((myDifferentDate % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = Math.floor((myDifferentDate % (1000 * 60)) / 1000)
  getCountDownDate(days, hours, minutes, seconds)
}

const getCountDownDate = (days, hours, minutes, seconds) => {
  if (prevNowDate) {
    clearInterval(prevNowDate)
  }
  prevNowDate = setInterval(() => {
    document.querySelector('.dateLaunch').textContent =
      days +
      ' day ' +
      hours +
      ' hours ' +
      minutes +
      ' minutes ' +
      seconds +
      ' seconds '
    seconds--
    if (seconds <= 0 && minutes > 0) {
      seconds = 59
      minutes--
    } else if (seconds <= 0 && minutes <= 0 && hours > 0) {
      seconds = 59
      minutes = 59
      hours--
    } else if (seconds <= 0 && minutes <= 0 && hours <= 0 && days > 0) {
      seconds = 59
      minutes = 59
      hours = 23
      days--
    } else if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
      clearInterval(prevNowDate)
      document.querySelector('.dateLaunch').textContent = 'EXPIRED'
    }
  }, 1000)
}

const main = () => {
  getPicture()
  getLaunchesUpComing()
}

document.addEventListener('DOMContentLoaded', main)
document.querySelector('.left-button').addEventListener('click', goLeftSide)
document.querySelector('.right-button').addEventListener('click', goRightSide)
