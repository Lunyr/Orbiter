export default (theme) => ({
  chooseGasTitle: {
    fontSize: 18,
  },
  note: {
    textAlign: 'center',
    paddingBottom: 10,
    marginBottom: 10,
  },
  noteText: {
    opacity: 0.5,
    fontSize: 13,
  },
  balance: {
    opacity: 0.9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px 10px',
  },
  gasFeeSlider: {
    width: '95%',
    marginTop: 10,
  },
  gwei: {
    opacity: 0.6,
    fontSize: 10,
  },
  sliderNum: {
    fontWeight: 600,
  },
  gasInputContainer: {
    width: 63,
    position: 'relative',
  },
  gasFee: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  gasChoice: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0 10px 0',
    justifyContent: 'space-between',
    width: '100%',
  },
  gasInput: {
    marginTop: 0,
    '@media only screen and (min-width: 768px)': {
      height: 30,
      fontSize: 14,
    },
  },
  dollarLabel: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 12,
    opacity: 0.8,
  },
  label: {
    display: 'block',
    marginBottom: 5,
    color: '#354052',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 500,
  },
  input: {
    width: '100%',
    height: '46px',
    borderRadius: '4px',
    border: '1px solid #DDDDDD',
    boxSizing: 'border-box',
    paddingLeft: '20px',
    color: '#354052',
    fontFamily: 'Roboto',
    fontSize: '16px',
    marginTop: '10px',
    '@media only screen and (max-width: 768px)': {
      fontSize: '12px',
      height: '30px',
    },
  },
  conversion: {
    opacity: '.5',
    paddingLeft: '5px',
  },
  gasFeeContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 40,
    width: '100%',
  },
  gasFeeTitle: {
    color: '#354052',
    fontFamily: 'Roboto',
    fontSize: '14px',
    paddingBottom: '10px',
    textAlign: 'center',
  },
  gasValue: {
    color: '#354052',
    fontFamily: 'Roboto',
    fontSize: '16px',
  },
  noShow: {
    display: 'none',
  },
  determiningLow: {
    color: '#777777',
  },
});
