import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'
import { selectors } from 'data'
import { RecoverSteps } from 'data/types'

import { Props as OwnProps } from '..'
import { BackArrowFormHeader, GoBackArrow, RecoveryCircleBackground } from '../model'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
`
const Row = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`
const IconTextRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`

const TextStack = styled.div`
  max-width: 312px;
`
const RecoveryOptions = (props: Props) => {
  const {
    authActions,
    cacheActions,
    cachedEmail,
    cachedGuid,
    formActions,
    formValues,
    nabuId,
    routerActions,
    setStep
  } = props
  return (
    <>
      {!cachedEmail ? (
        <GoBackArrow handleBackArrowClick={() => routerActions.push('/login')} />
      ) : (
        <BackArrowFormHeader
          handleBackArrowClick={() => routerActions.push('/login')}
          email={cachedEmail}
          guid={cachedGuid}
        />
      )}
      <FormBody>
        <Text color='grey900' size='20px' weight={600} lineHeight='1.5'>
          <FormattedMessage
            id='scenes.login.recovery_options.title'
            defaultMessage='Recovery Options'
          />
        </Text>
        <IconTextRow
          onClick={() => formActions.change('recover', 'step', RecoverSteps.CLOUD_RECOVERY)}
        >
          <RecoveryCircleBackground color='blue000'>
            <Icon name='cloud' color='blue600' size='16px' />
          </RecoveryCircleBackground>
          <TextStack>
            <Text color='grey900' size='14px' weight={600} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.recovery_options.cloud_backup.title'
                defaultMessage='Recover Account with Cloud Backup'
              />
            </Text>
            <Text color='grey600' size='12px' weight={500} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.recovery_options.cloud_backup'
                defaultMessage='Restore your account using your phone and the cloud.'
              />
            </Text>
          </TextStack>
          <Icon name='chevron-right' size='20px' color='grey400' />
        </IconTextRow>
        <IconTextRow
          onClick={() => formActions.change('recover', 'step', RecoverSteps.RECOVERY_PHRASE)}
        >
          <RecoveryCircleBackground color='blue000'>
            <Icon name='keyboard' color='blue600' size='22px' />
          </RecoveryCircleBackground>
          <TextStack>
            <Text color='grey900' size='14px' weight={600} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.recovery_options.phrase.title'
                defaultMessage='Recover Account with Recovery Phrase'
              />
            </Text>
            <Text color='grey600' size='12px' weight={500} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.login.recovery_options.phrase'
                defaultMessage='Restore your account with your 12-word Secret Private key Recovery Phrase.'
              />
            </Text>
          </TextStack>
          <Icon name='chevron-right' size='20px' color='grey400' />
        </IconTextRow>
      </FormBody>
      <Row>
        <Text size='13px' weight={600} color='grey600'>
          <FormattedMessage
            id='scenes.login.trouble_logging_in'
            defaultMessage='Trouble Logging In?'
          />
        </Text>
        {nabuId ? (
          <Text
            size='13px'
            weight={600}
            color='blue600'
            data-e2e='troubleLoggingIn'
            cursor='pointer'
            onClick={() => formActions.change('recover', 'step', RecoverSteps.RESET_ACCOUNT)}
            style={{ marginLeft: '4px' }}
          >
            <FormattedMessage
              id='scenes.login.reset_your_account.arrow'
              defaultMessage='Reset your account ->'
            />
          </Text>
        ) : (
          <Link
            weight={600}
            size='13px'
            target='_blank'
            href='https://support.blockchain.com/'
            style={{ marginLeft: '2px' }}
          >
            <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
          </Link>
        )}
      </Row>
    </>
  )
}

const mapStateToProps = (state) => ({
  nabuId: selectors.auth.getNabuId(state)
})

const connector = connect(mapStateToProps)

type Props = OwnProps & {
  setStep: (step: RecoverSteps) => void
} & ConnectedProps<typeof connector>

export default connector(RecoveryOptions)