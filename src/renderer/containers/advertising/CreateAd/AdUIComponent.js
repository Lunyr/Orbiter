import React from 'react';
import injectStyles from 'react-jss';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import toast from 'react-toastify';
import cx from 'classnames';
import { FaUpload as UploadIcon, FaLongArrowAltRight as LongArrowRightIcon } from 'react-icons/fa';

class AdUIComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUploadingPhoto: false,
      hash: '',
      crop: false,
      acceptedFiles: null,
    };
  }

  /***
   * Uploads photo to IPFS and returns a hash for the ad photo
   * @params [acceptedFiles] -- the list of accepted files
   * @params [rejectedFiles] -- the list of all rejected files
   */
  uploadPhoto = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length === 0) {
      this.setState({
        crop: true,
        preview: acceptedFiles[0].preview,
        name: acceptedFiles[0].name,
      });
    }
  };

  /***
   * Converts data url to blob
   */
  dataURItoBlob = (dataURI) => {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = window.atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    let ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    let blob = new window.Blob([ab], { type: mimeString });
    return blob;
  };

  /***
   * Crops the photo
   */
  _crop = async () => {
    // e.preventDefault();
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }

    let dataUrl = this.cropper.getCroppedCanvas().toDataURL();
    let blob = this.dataURItoBlob(dataUrl);
    // let dataFile = new File(blob, this.state.name); //await toFile(dataUrl);
    this.setState({
      isUploadingPhoto: true,
    });
    let hash = await this.props.ipfsUpload(blob);

    this.setState({
      isUploadingPhoto: false,
      crop: false,
      hash,
    });

    this.props.onChange('imageHash', hash);
  };

  /***
   * Set redux to the input
   * @params string value -- the value of the input
   * @params string key -- which input it is, the key to set in redux
   */
  sendToRedux = (value, key) => {
    this.props.onChange(key, value);
  };

  /***
   * Update the backend to add a click when the ad is clicked
   */
  adClicked = () => {
    console.log('Ad was clicked');
  };

  /***
   * On a rejected file drop
   */
  onDropRejected = () => {
    toast.error('The file you tried to upload was too big. Try again with another file under 2mb.');
  };

  render() {
    const { classes } = this.props;
    return (
      <div
        className={cx(
          classes.preview,
          this.props.url && classes.click,
          this.props.side && classes.previewSide
        )}
        onClick={this.adClicked}>
        {this.props.hash ? (
          <div className={classes.imgZone}>
            <img
              alt={'Advertising'}
              src={`https://ipfs.io/ipfs/${this.props.hash}`}
              className={cx(
                classes.advertisingImage,
                this.props.side && classes.advertisingImageSide
              )}
            />
            <div className={cx(classes.overlay, this.props.side && classes.sideOverlay)}>
              Sponsored
            </div>
          </div>
        ) : this.state.crop ? (
          <div className={classes.crop}>
            <div className={classes.cropWrapper}>
              {this.state.isUploadingPhoto ? (
                <div className={classes.uploadingPhoto}>
                  <UploadIcon className={classes.upload} />
                </div>
              ) : null}
              <Cropper
                ref={(ref) => (this.cropper = ref)}
                className={classes.cropper}
                src={this.state.preview}
                // Cropper.js options
                aspectRatio={1}
                guides={false}
              />
            </div>
          </div>
        ) : (
          <Dropzone
            onDrop={this.uploadPhoto}
            required={true}
            className={cx(classes.imageUpload, this.state.hash && classes.hash)}
            onMouseEnter={() => this.setState({ uploadEntered: true })}
            maxSize={2e6}
            onDropRejected={this.onDropRejected}
            onMouseLeave={() => this.setState({ uploadEntered: false })}>
            {this.state.hash ? (
              <img
                alt={'Advertising'}
                src={`https://ipfs.io/ipfs/${this.state.hash}`}
                className={cx(
                  classes.advertisingImage,
                  this.props.side && classes.advertisingImageSide
                )}
              />
            ) : (
              <UploadIcon className={cx(this.state.uploadEntered && classes.uploadHover)} />
            )}
          </Dropzone>
        )}
        {this.state.crop ? null : (
          <div className={cx(classes.textArea, this.props.side && classes.textAreaSide)}>
            {!this.props.edit ? (
              <div className={cx(classes.adTitle, this.props.side && classes.adTitleSide)}>
                {' '}
                {this.props.title ? this.props.title : 'Title of Ad'}{' '}
              </div>
            ) : (
              <input
                onChange={(e) => this.sendToRedux(e.target.value, 'title')}
                defaultValue={this.props.title}
                className={cx(classes.input, classes.adTitle)}
                placeholder={'Title of ad'}
                required={true}
              />
            )}
            {!this.props.edit ? (
              <div className={cx(classes.adBody, this.props.side && classes.adBodySide)}>
                {' '}
                {this.props.body ? this.props.body : 'Body Text'}{' '}
              </div>
            ) : (
              <textarea
                defaultValue={this.props.body}
                onChange={(e) => this.sendToRedux(e.target.value, 'body')}
                className={cx(classes.input, classes.adBody)}
                placeholder={'Body of ad'}
                required={true}
              />
            )}

            <div className={cx(classes.actionLabel, this.props.side && classes.actionLabelSide)}>
              {!this.props.edit ? (
                <div
                  className={cx(
                    classes.actionLabelInput,
                    this.props.side && classes.actionLabelInputSide
                  )}>
                  {' '}
                  {this.props.actionLabel ? this.props.actionLabel : 'Action Label'}{' '}
                </div>
              ) : (
                <input
                  defaultValue={this.props.actionLabel}
                  onChange={(e) => this.sendToRedux(e.target.value, 'actionLabel')}
                  className={cx(classes.input, classes.actionLabelInput)}
                  placeholder={'Name of action'}
                  required={true}
                />
              )}
              <LongArrowRightIcon />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  advertisingImage: {
    objectFit: 'cover',
    height: '75px',
    width: '75px',
    '@media only screen and (min-width: 1024px)': {
      width: '85px',
      height: '85px',
    },
    '@media only screen and (min-width: 1250px)': {
      height: '107px',
      width: '107px',
    },
  },
  crop: {
    display: 'flex',
    alignItems: 'center',
  },
  cropWrapper: {
    position: 'relative',
    marginRight: '30px',
  },
  uploadingPhoto: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, .4)',
    zIndex: '2',
  },
  upload: {
    position: 'absolute',
    color: '#fff',
    top: '50%',
    left: '50%',
    fontSize: '1.5em',
    transform: 'translate(-50%, -50%)',
  },
  cropper: {
    width: '200px',
    height: '107px',
  },
  advertisingImageSide: {
    objectFit: 'cover',

    '@media only screen and (min-width: 1024px)': {
      height: '230px',
      width: '100%',
    },

    '@media only screen and (min-width: 1250px)': {
      height: '250px',
      width: '100%',
    },
  },
  imgZone: {
    position: 'relative',
  },
  overlay: {
    opacity: '.5',
    letterSpacing: '.6px',
    color: '#000',
    textAlign: 'center',
    marginTop: '5px',
    fontSize: '12px',
    background: 'rgba(0, 0, 0, .3)',
    borderRadius: '4px',
    padding: '3px',
  },
  sideOverlay: {
    position: 'absolute',
    color: '#fff',
    bottom: '20px',
    right: '20px',
    fontSize: '16px',
  },
  imageUpload: {
    cursor: 'pointer',
    backgroundColor: '#D8D8D8',
    borderRadius: '5px',
    height: '75px',
    width: '75px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '@media only screen and (min-width: 768px)': {
      height: '107px',
      width: '107px',
    },
  },
  click: {
    cursor: 'pointer',
  },
  preview: {
    textDecoration: 'none',
    display: 'flex',
    boxShadow: '0 12px 44px 0 rgba(0,0,0,0.08)',
    padding: '20px',
    // height: '127px',
    position: 'relative',
    background: '#fff',
    flex: 1,

    '@media only screen and (min-width: 1024px)': {
      maxWidth: '380px',
    },

    '@media only screen and (min-width: 1440px)': {
      maxWidth: '440px',
    },
  },
  previewSide: {
    flexDirection: 'column',
    padding: 'none',
    '@media only screen and (min-width: 1024px)': {
      width: '230px',
      // height: '230px',
      maxWidth: '230px',
      height: 'unset',
    },

    '@media only screen and (min-width: 1250px)': {
      maxWidth: '280px',
      width: '280px',
      // height: '250px',
      height: 'unset',
    },
  },
  hash: {
    background: 'none',
  },
  textArea: {
    flex: 1,
    paddingLeft: '24px',
    position: 'relative',
  },
  textAreaSide: {
    padding: '10px 30px',
    background: '#fff',
  },
  adTitle: {
    color: '#494D5F',
    fontSize: '20px',
    marginBottom: '5px',
    height: 'initial',
    padding: '5px',
  },
  adBody: {
    color: '#494D5F',
    // opacity: '.6',
    fontSize: '14px',
    padding: '5px',
    maxHeight: '35px',
    overflow: 'hidden',
    marginBottom: '40px',
    resize: 'none',
    // height: '60px',
  },
  adBodySide: {
    maxHeight: '45px',
    marginBottom: '20px',
  },
  actionLabel: {
    color: '#FF8174',
    fontSize: '14px',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: '0px',
    display: 'flex',
    alignItems: 'center',
    left: '15px',
    paddingRight: '20px',

    '@media only screen and (min-width: 768px)': {
      left: 'unset',
    },
  },
  actionLabelSide: {
    position: 'unset',
    marginTop: '10px',
  },
  actionLabelInput: {
    flex: 1,
    width: 'auto',
    height: 'initial',
    padding: '5px',
    fontSize: '13px',
    color: '#FF8174',
    borderColor: '#FF8174',

    '::placeholder': {
      color: '#FF8174',
    },
  },
  textarea: {
    height: '62px',
    padding: '10px',
    width: 'calc(100% - 20px)',
    border: '1px solid rgba(0, 0, 0, .1)',
    resize: 'none',
  },
  label: {
    color: '#3A3C49',
    fontSize: '14px',
    marginBottom: '3px',
  },
  input: {
    width: 'calc(100% - 20px)',
    height: '42px',
    border: '1px solid rgba(0, 0, 0, .1)',
    borderRadius: '4px',
    fontSize: '14px',
    padding: '0px 10px',
  },
});

export default injectStyles(styles)(AdUIComponent);
