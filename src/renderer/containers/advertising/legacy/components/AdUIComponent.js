/***
 * Advertising UI component
 * @patr -- patrick@quantfive.org
 */

import React from 'react';

// NPM Modules
import { StyleSheet, css } from 'aphrodite';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';

// Components
import ReviewBackButton from '../../review/ReviewBackButton';

// Stylesheets
import 'cropperjs/dist/cropper.css';

export default class AdUIComponent extends React.Component {
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
  dataURItoBlob = dataURI => {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
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

    var dataUrl = this.cropper.getCroppedCanvas().toDataURL();
    var blob = this.dataURItoBlob(dataUrl);
    // var dataFile = new File(blob, this.state.name); //await toFile(dataUrl);
    this.setState({
      isUploadingPhoto: true,
    });
    var hash = await this.props.ipfsUpload(blob);

    this.setState({
      isUploadingPhoto: false,
      crop: false,
      hash,
    });

    this.props.updateAdInfo(hash, 'imageHash');
  };

  /***
   * Set redux to the input
   * @params string value -- the value of the input
   * @params string key -- which input it is, the key to set in redux
   */
  sendToRedux = (value, key) => {
    this.props.updateAdInfo(value, key);
  };

  /***
   * Update the backend to add a click when the ad is clicked
   */
  adClicked = () => {
    if (this.props.adClicked) this.props.adClicked(this.props.hash);
  };

  /***
   * On a rejected file drop
   */
  onDropRejected = () => {
    let { messageActions } = this.props;
    messageActions.setMessage(
      'The file you tried to upload was too big. Try again with another file under 2mb.',
      'error',
      true
    );
  };

  render() {
    return (
      <a
        target="_blank"
        href={this.props.url}
        className={css(
          styles.preview,
          this.props.url && styles.click,
          this.props.side && styles.previewSide
        )}
        onClick={this.adClicked}
      >
        {this.props.hash ? (
          <div className={css(styles.imgZone)}>
            <img
              alt={'Advertising'}
              src={`https://ipfs.io/ipfs/${this.props.hash}`}
              className={css(
                styles.advertisingImage,
                this.props.side && styles.advertisingImageSide
              )}
            />
            <div className={css(styles.overlay, this.props.side && styles.sideOverlay)}>
              Sponsored
            </div>
          </div>
        ) : this.state.crop ? (
          <div className={css(styles.crop)}>
            <div className={css(styles.cropWrapper)}>
              {this.state.isUploadingPhoto ? (
                <div className={css(styles.uploadingPhoto)}>
                  <i className={css(styles.upload) + ' fa fa-spin fa-spinner'} />
                </div>
              ) : null}
              <Cropper
                ref={ref => (this.cropper = ref)}
                className={css(styles.cropper)}
                src={this.state.preview}
                // Cropper.js options
                aspectRatio={1}
                guides={false}
              />
            </div>
            <ReviewBackButton text={'Crop'} back={this._crop} />
          </div>
        ) : (
          <Dropzone
            onDrop={this.uploadPhoto}
            required={true}
            className={css(styles.imageUpload, this.state.hash && styles.hash)}
            onMouseEnter={() => this.setState({ uploadEntered: true })}
            maxSize={2e6}
            onDropRejected={this.onDropRejected}
            onMouseLeave={() => this.setState({ uploadEntered: false })}
          >
            {this.state.hash ? (
              <img
                alt={'Advertising'}
                src={`https://ipfs.io/ipfs/${this.state.hash}`}
                className={css(
                  styles.advertisingImage,
                  this.props.side && styles.advertisingImageSide
                )}
              />
            ) : (
              <i
                className={css(this.state.uploadEntered && styles.uploadHover) + ' fa fa-upload'}
                aria-hidden="true"
              />
            )}
          </Dropzone>
        )}
        {this.state.crop ? null : (
          <div className={css(styles.textArea, this.props.side && styles.textAreaSide)}>
            {!this.props.edit ? (
              <div className={css(styles.adTitle, this.props.side && styles.adTitleSide)}>
                {' '}
                {this.props.title ? this.props.title : 'Title of Ad'}{' '}
              </div>
            ) : (
              <input
                onChange={e => this.sendToRedux(e.target.value, 'title')}
                defaultValue={this.props.title}
                className={css(styles.input, styles.adTitle)}
                placeholder={'Title of ad'}
                required={true}
              />
            )}
            {!this.props.edit ? (
              <div className={css(styles.adBody, this.props.side && styles.adBodySide)}>
                {' '}
                {this.props.body ? this.props.body : 'Body Text'}{' '}
              </div>
            ) : (
              <textarea
                defaultValue={this.props.body}
                onChange={e => this.sendToRedux(e.target.value, 'body')}
                className={css(styles.input, styles.adBody)}
                placeholder={'Body of ad'}
                required={true}
              />
            )}

            <div className={css(styles.actionLabel, this.props.side && styles.actionLabelSide)}>
              {!this.props.edit ? (
                <div
                  className={css(
                    styles.actionLabelInput,
                    this.props.side && styles.actionLabelInputSide
                  )}
                >
                  {' '}
                  {this.props.actionLabel ? this.props.actionLabel : 'Action Label'}{' '}
                </div>
              ) : (
                <input
                  defaultValue={this.props.actionLabel}
                  onChange={e => this.sendToRedux(e.target.value, 'actionLabel')}
                  className={css(styles.input, styles.actionLabelInput)}
                  placeholder={'Name of action'}
                  required={true}
                />
              )}
              <i
                style={{ marginLeft: '10px' }}
                className="fa fa-long-arrow-right"
                aria-hidden="true"
              />
            </div>
          </div>
        )}
      </a>
    );
  }
}

var styles = StyleSheet.create({
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
