export default (theme) => ({
  myAds: {
    background: '#fff',
    borderRadius: '4px',
    fontFamily: 'Roboto',
    width: 'calc(100% - 30px)',
    minHeight: 250,
  },
  header: {
    padding: '25px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
  },
  myAdsTitle: {
    fontSize: '26px',
    fontWeight: '300',
    color: '#3C394C',
  },
  bullHorn: {
    marginRight: '8px',
  },
  createAnAd: {
    marginLeft: 'auto',
    color: '#626DFF',
    fontSize: '14px',
    padding: '10px 8px',
    background: '#fff',
    borderRadius: '4px',
    outline: 'none',
    border: '1px solid #626DFF',
    cursor: 'pointer',
  },
  ads: {
    padding: '15px',
  },
  adHeaders: {
    display: 'flex',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
    fontWeight: '500',
    color: '#8D8E90',
    textTransform: 'uppercase',
    fontSize: '12px',
  },
  startOfAds: {
    marginTop: '5px',
  },
  ad: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
  },
  adImage: {
    height: '50px',
    width: '50px',
    borderRadius: '6px',
    objectFit: 'scale-down',
  },
  adName: {
    marginLeft: '15px',
  },
  active: {
    opacity: '.6',
    width: '60px',
    height: '20px',
    color: '#fff',
    fontSize: '11px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
  activeAd: {
    background: '#6DB71D',
  },
  expiredAd: {
    background: '#868C97',
  },
  pendingAd: {
    background: '#EAC234',
  },
  published: {
    marginLeft: '20px',

    '@media only screen and (min-width: 1024px)': {
      marginLeft: '42px',
    },

    '@media only screen and (min-width: 1440px)': {
      marginLeft: '38px',
    },
  },
  endOn: {
    '@media only screen and (min-width: 1024px)': {
      marginLeft: '90px',
    },

    '@media only screen and (min-width: 1440px)': {
      marginLeft: '136px',
    },
  },
  bid: {
    '@media only screen and (min-width: 1024px)': {
      marginLeft: '95px',
    },

    '@media only screen and (min-width: 1440px)': {
      marginLeft: '113px',
    },
  },
  adShare: {
    '@media only screen and (min-width: 1024px)': {
      marginLeft: '83px',
    },

    '@media only screen and (min-width: 1440px)': {
      marginLeft: '75px',
    },
  },
});
