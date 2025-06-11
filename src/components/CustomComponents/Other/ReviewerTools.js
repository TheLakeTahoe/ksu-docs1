import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { goToEditState, sendAnnotation } from '../../../http/documentAPI';

const ReviwerTools = ({ requestID, isAnnotation, dataToSend }) => {

    const Decline = () => {
        console.log('DECLINE')
    }


    const Edit = () => {
        if (dataToSend) {
            console.log(dataToSend)
            sendAnnotation(dataToSend, requestID)
            goToEditState(requestID)
        }
    }

    const Accept = () => {
        console.log('ACCEPT')
    }

    return (
        <>
            <Alert variant="info">
                <Alert.Heading>Информация для проверяющих!</Alert.Heading>
                <strong>Проверьте все документы</strong>, они отправляются <strong>только со страницы Аннотации ДОП.</strong><hr />
                Если на Ваш взгляд информация в поле введена неверно, то проставьте флаг "Есть ошибки" и укажите что с полем не так.
            </Alert>
            {isAnnotation && (
                <Row>
                    <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button className='mb-3 ms-2' style={{ backgroundColor: 'rgb(255, 102, 102)', border: '1px solid rgba(0, 0, 0, .1)', fontWeight: '500' }} onClick={Decline}>Отклонить</Button>
                        <Button className='mb-3 ms-2' style={{ backgroundColor: 'rgb(255, 223, 102)', border: '1px solid rgba(0, 0, 0, .1)', color: 'black', fontWeight: '500' }} onClick={Edit}>На корректировку</Button>
                        <Button className='mb-3 ms-2' style={{ backgroundColor: 'rgb(102, 204, 153)', border: '1px solid rgba(0, 0, 0, .1)', fontWeight: '500' }} onClick={Accept}>Одобрить</Button>
                    </Col>
                </Row>
            )}
            <hr />
        </>
    );
}

export default ReviwerTools;
