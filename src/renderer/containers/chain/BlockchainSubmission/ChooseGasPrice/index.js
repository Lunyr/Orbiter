import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';
import { Slider } from '../../../../components';
import { gweiToUsd, normalizeGwei } from '../../../../../shared/utils';
import GasFeeDisplay from '../GasFeeDisplay/';
import styles from './styles';

/*
* Returns an array of gwei marks based on a minimumGwei, additionalGwei, modifider, and stepSize
*/
const calculateGweiMarks = (gweiLow, additionalGwei, modifier, stepSize) => {
  let marks = [];
  const largestGweiMark = (gweiLow + additionalGwei) * modifier + stepSize;
  const gweiMarkIncrementer = stepSize * modifier;
  let gweiMark = gweiLow * modifier + stepSize;
  for (; gweiMark <= largestGweiMark; gweiMark += gweiMarkIncrementer) {
    marks.push(gweiMark);
  }
  return marks;
};

/*
* Returns an object refrence for the number of gwei marks to show. The keys are
* the mark indices with component values for displaying gwei and usd totals.
{
  '2.5': <Component>,
  '3': <Component>,
  '3.5': <Component>,
  etc...
}
*/
const generateGweiMarks = ({
  additionalGwei,
  classes,
  gasAmount,
  gweiLow,
  modifier,
  stepSize,
  ethereumConversionRate,
}) => {
  const gweiMarks = calculateGweiMarks(gweiLow, additionalGwei, modifier, stepSize);
  return gweiMarks.reduce((acc, gwei) => {
    acc[gwei] = (
      <div key={gwei}>
        <span className={classes.sliderNum}>
          {`$${gweiToUsd(gwei, gasAmount, ethereumConversionRate)}`}
        </span>
        <div className={classes.gwei}>{`${normalizeGwei(gwei)} Gwei`}</div>
      </div>
    );
    return acc;
  }, {});
};

const ChooseGasPrice = ({
  additionalGwei = 2.5,
  balance,
  classes,
  fee,
  gasAmount,
  gweiLow,
  modifier = 1,
  onSliderChangeFee,
  showing,
  stepSize = 0.5,
  ethereumConversionRate,
}) => {
  if (!gweiLow) {
    return <span className={classes.determiningLow}>Determining a safe GWEI...</span>;
  }
  const marks = generateGweiMarks({
    additionalGwei,
    classes,
    gasAmount,
    gweiLow,
    modifier,
    stepSize,
    ethereumConversionRate,
  });
  return (
    <div className={cx(classes.gasFeeContainer, !showing && classes.noShow)}>
      <span className={classes.gasFeeTitle}>
        <span className={classes.chooseGasTitle}>Choose Gas Price</span>
        <span className={classes.conversion}>(estimated)</span>
      </span>
      <div className={classes.note}>
        <div className={classes.noteText}>
          <span>NOTE: A lower gas price will take longer to process.</span>
        </div>
        <div className={classes.noteText}>
          Check
          <a
            style={{ color: '#000', margin: '0 5px' }}
            target="_blank"
            href="http://ethgasstation.info/"
            rel="noopener noreferrer">
            http://ethgasstation.info/
          </a>
          for wait times.
        </div>
      </div>
      <GasFeeDisplay fee={fee} balance={balance} ethereumConversionRate={ethereumConversionRate} />
      <div className={classes.gasFeeSlider}>
        <Slider
          trackStyle={{ background: '#6589DE' }}
          handleStyle={{ borderColor: '#6589DE' }}
          dotStyle={{ borderColor: '#6589DE' }}
          activeDotStyle={{ background: '#6589DE' }}
          onChange={onSliderChangeFee}
          min={gweiLow * modifier + stepSize}
          marks={marks}
          step={stepSize * modifier}
          defaultValue={gweiLow * modifier}
          max={(gweiLow + additionalGwei) * modifier + stepSize}
        />
      </div>
    </div>
  );
};

export default injectStyles(styles)(ChooseGasPrice);
