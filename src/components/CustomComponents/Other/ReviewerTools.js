import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { goToEditState, sendDocument } from '../../../http/documentAPI';

const fieldsByDoc = {
    ANN: [
        'commonData.program.program_type',
        'commonData.program.program_name',
        'commonData.program.standart_compliance',
        'commonData.program.program_goal',
        'commonData.program.listeners_category',
        'commonData.hours.academic',
        'commonData.hours.overall',
        'commonData.lesson.count',
        'commonData.lesson.duration',
    ],
    EDP: [
        'commonData.program.program_goal',
        'commonData.program.listeners_category',
        'commonData.program.education_form',
        'commonData.hours.academic',
        'commonData.lesson.count',
        'commonData.lesson.duration',
    ],
    ETP: [
        'commonData.program.program_goal',
        'commonData.program.standart_compliance',
        'commonData.program.education_form',
    ],
    EEP: [], // нет полей для проверки
    IAS: [], // нет полей для проверки
};

// Проверяем, есть ли ошибки по заданным полям в commonData.errors
const hasErrorsForFields = (fields, commonDataErrors) => {
    for (const fieldPath of fields) {
        // Для проверки ошибки нужно взять поле из errors, которое совпадает с последним ключом из пути
        // Например: для commonData.program.program_name -> errors.program.program_name
        const keys = fieldPath.split('.');
        if (keys.length < 3) continue; // Структура: commonData.*.*
        const errorSection = commonDataErrors?.[keys[1]];
        const errorField = keys[2];
        if (errorSection && errorSection[errorField]) {
            return true;
        }
    }
    return false;
};

const ReviwerTools = ({ requestID, isAnnotation, dataToSend }) => {

    const Decline = () => {
        console.log('DECLINE')
    }

    const checkAndUpdateFlags = (data) => {
        if (!data || !data.commonData) return data;

        // Создаем копию данных, чтобы не мутировать пропсы
        const newData = { ...data };

        // Для каждого документа проверяем ошибки и ставим флаг false, если ошибки есть
        ['ANN', 'EDP', 'EEP', 'ETP', 'IAS'].forEach((docKey) => {
            const fieldsToCheck = fieldsByDoc[docKey] || [];
            if (fieldsToCheck.length === 0) {
                // Если полей нет, не меняем флаг
                return;
            }
            const errors = newData.commonData.errors || {};
            if (hasErrorsForFields(fieldsToCheck, errors)) {
                newData[docKey] = false;
            }
        });

        return newData;
    };

    const Edit = () => {
        if (dataToSend) {
            const updatedData = checkAndUpdateFlags(dataToSend);
            sendDocument(updatedData, requestID);
            goToEditState(requestID);
        }
    }

    const Accept = () => {
        if (dataToSend) {
            const updatedData = checkAndUpdateFlags(dataToSend);
            sendDocument(updatedData, requestID);
            console.log('ACCEPT');
        }
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
