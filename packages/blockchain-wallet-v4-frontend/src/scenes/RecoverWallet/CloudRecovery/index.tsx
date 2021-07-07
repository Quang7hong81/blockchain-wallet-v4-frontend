import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Badge, Button, Icon, Link, Text, TextGroup } from 'blockchain-info-components'
import { crypto as wCrypto } from 'blockchain-wallet-v4/src'
import { SuccessCartridge } from 'components/Cartridge'
import QRCodeWrapper from 'components/QRCodeWrapper'
import { RemoteDataType } from 'core/types'
import { actions, selectors } from 'data'
import { RecoverSteps } from 'data/types'

import { Props as OwnProps } from '..'
import { BackArrowFormHeader, CartridgeSentContainer, Column, Row } from '../model'

const Body = styled.div`
  display: flex;
  margin-bottom: 8px;
`
const TextColumn = styled(Column)`
  max-width: 60%;
  margin-right: 16px;
`
const ActionButtons = styled(Column)`
  align-items: center;
`
const BadgeRow = styled(Row)`
  justify-content: center;
  margin: 24px 0;
  & > :first-child {
    margin-right: 16px;
  }
`

const CloudRecovery = (props: Props) => {
  const {
    authActions,
    cacheActions,
    cachedEmail,
    cachedGuid,
    formActions,
    formValues,
    loginFormValues,
    middlewareActions,
    qrData,
    setStep
  } = props

  return (
    <>
      <BackArrowFormHeader
        handleBackArrowClick={() => props.setStep(RecoverSteps.RECOVERY_OPTIONS)}
        email={cachedEmail}
        guid={cachedGuid}
      />
      <Body>
        {!props.phonePubKey && (
          <TextColumn>
            <Icon name='padlock' color='blue600' size='20px' style={{ padding: '0 0 16px 4px' }} />
            <Text
              color='grey900'
              size='16px'
              weight={600}
              lineHeight='1.5'
              style={{ marginBottom: '8px' }}
            >
              <FormattedMessage id='scenes.login.qrcodelogin' defaultMessage='QR Code Log In' />
            </Text>
            <Text
              color='grey900'
              size='12px'
              weight={500}
              lineHeight='1.5'
              style={{ marginBottom: '16px' }}
            >
              <FormattedMessage
                id='scenes.recovery.cloud_backup.subtitle'
                defaultMessage='It seems like your wallet had at one point been backed up to the cloud.'
              />
            </Text>
            <Text
              color='grey900'
              size='12px'
              weight={500}
              lineHeight='1.5'
              style={{ marginBottom: '16px' }}
            >
              <FormattedMessage
                id='scenes.recovery.cloud_backup.instructions_one'
                defaultMessage='Scan this QR code with your Blockchain.com mobile app.'
              />
            </Text>
            <Row>
              <Text
                color='grey900'
                size='12px'
                weight={500}
                lineHeight='1.5'
                style={{ marginRight: '4px' }}
              >
                <FormattedMessage
                  id='scenes.recovery.cloud_backup.instructions_two'
                  defaultMessage='Tap the QR Code Scanner icon'
                />
              </Text>
              <Icon name='qr-code' color='grey600' size='12px' />
            </Row>
            <Text color='grey900' size='12px' weight={500} lineHeight='1.5'>
              <FormattedMessage
                id='scenes.recovery.cloud_backup.instructions_three'
                defaultMessage='in the top right & point here.'
              />
            </Text>
          </TextColumn>
        )}
        {props.secureChannelLoginState.cata({
          Failure: (e) => (
            <Text>
              {typeof e === 'string' ? (
                e
              ) : (
                <FormattedMessage
                  id='scenes.login.qrcodelogin_failed'
                  defaultMessage='Login failed. Please refresh browser and try again.'
                />
              )}
            </Text>
          ),
          Loading: () => {
            return (
              <Text size='14px' weight={600}>
                <FormattedMessage
                  id='scenes.login.qrcodelogin_success_confirm'
                  defaultMessage='Please confirm the login on your mobile device.'
                />
              </Text>
            )
          },
          NotAsked: () => <QRCodeWrapper value={qrData} size={175} showImage />,
          Success: () => {
            return (
              <Text size='14px' weight={600}>
                <FormattedMessage
                  id='scenes.login.qrcodelogin_success'
                  defaultMessage='Success! Logging in...'
                />
              </Text>
            )
          }
        })}
      </Body>
      <BadgeRow>
        <Badge size='40px' type='applestore' />
        <Badge size='40px' type='googleplay' />
      </BadgeRow>
      <ActionButtons>
        <Button
          nature='empty-blue'
          fullwidth
          height='48px'
          data-e2e='loginWithPassword'
          style={{ marginBottom: '24px' }}
          // we want to send them to login here
          // onClick={() => setStep(RecoverSteps.ENTER_PASSWORD)}
        >
          <FormattedMessage id='buttons.login_with_password' defaultMessage='Login with Password' />
        </Button>
        <LinkContainer to='/help'>
          <Link size='13px' weight={600} data-e2e='loginGetHelp'>
            <FormattedMessage id='copy.need_some_help' defaultMessage='Need some help?' />
          </Link>
        </LinkContainer>
      </ActionButtons>
    </>
  )
}

const mapStateToProps = (state) => ({
  phonePubKey: selectors.cache.getPhonePubkey(state),
  qrData: selectors.cache.getChannelPrivKey(state)
    ? JSON.stringify({
        channelId: selectors.cache.getChannelChannelId(state),
        pubkey: wCrypto
          .derivePubFromPriv(Buffer.from(selectors.cache.getChannelPrivKey(state), 'hex'))
          .toString('hex'),
        type: 'login_wallet'
      })
    : '',
  secureChannelLoginState: selectors.auth.getSecureChannelLogin(state) as RemoteDataType<any, any>
})

const mapDispatchToProps = (dispatch) => ({
  middlewareActions: bindActionCreators(actions.ws, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & {
  setStep: (step: RecoverSteps) => void
} & ConnectedProps<typeof connector>

export default connector(CloudRecovery)