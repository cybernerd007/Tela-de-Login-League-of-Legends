<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js"></script>

<script>
$(document).ready(function() {
    // Oculta alertas
    $("div[role=alert]").css("display", "none");

    const form = $('form');
    $("[name=whatsapp]").mask('(00) 00000-0000');

    // Função para obter parâmetros da URL
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
              results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    // Captura UTMs e Gclids
    const utmSource = getParameterByName('utm_source');
    const utmMedium = getParameterByName('utm_medium');
    const utmCampaign = getParameterByName('utm_campaign');
    const utmContent = getParameterByName('utm_content');
    const utmTerm = getParameterByName('utm_term');
    const fbclid = getParameterByName('fbclid');
    const gclid = getParameterByName('gclid');

    form.submit(async function(event) {
        event.preventDefault();

        const listId = '901702333004';
        const inputFile = $("form input[type=file]").prop('files')[0];
        const description = `O tipo de obra que eu quero é: ${$('textarea').text()}`;

        // Captura o valor selecionado no dropdown
        const dropdownValue = $('#collection_comp-m1txprvy').val();

        const formData = {
            name: $('[name=Name]').val(),
            phone: $('[name=Whatsapp]').val(),
            description: $('textarea').text(),
            dropdownValue: dropdownValue // Adiciona o valor do dropdown ao formData
        };

        // Chave da API do ClickUp
        const apiToken = 'pk_84219238_CBUY2M5NAC33Y42OB5SMSC3FIM4UJUZK';

        // Configurações da solicitação POST para criar a tarefa
        const createTaskRequestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiToken,
            },
            body: JSON.stringify({
                custom_fields: [
                    { id: '98ac6f06-4a6d-484c-b422-62707582c3ce', value: "+55 " + formData.phone },
                    { id: '2c934c4c-996f-431a-87a3-8995a11aee6d', value: formData.name },
                    { id: '55146bad-982c-4be7-8751-535860eb1a23', value: formData.description },
                    { id: '23c2e07e-b75b-4b42-ac90-a5121f49dfcf', value: formData.dropdownValue },
                    { id: '034398ba-b998-4fbc-a021-297b8c2a7c3a', value: utmContent },
                    { id: '1df0eba8-9e67-4f36-a913-1fd1fdba2781', value: utmSource },
                    { id: '837cb94a-6f88-444f-8f78-2c9966afee58', value: utmCampaign },
                    { id: '9e7bb60c-a38c-4be6-8066-1a038a6cbb93', value: utmTerm },
                    { id: 'd1748807-d988-402a-8c53-7b6893ac344d', value: utmMedium },
                    { id: '60b1a2ce-18da-4bf6-bf81-556588f44355', value: fbclid },
                    { id: 'e69dfd5f-36a6-4d05-a87d-7fd2447d1a93', value: gclid },
                ],
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                assignees: [],
                group_assignees: [],
                name: formData.name,
                team_id: 9017105014,
                token: apiToken,
                description: description
            }),
        };

        const createTaskUrl = `https://api.clickup.com/api/v2/list/${listId}/task`;

        try {
            // Faz a solicitação para criar a tarefa
            const createTaskResponse = await fetch(createTaskUrl, createTaskRequestOptions);
            const taskData = await createTaskResponse.json();

            if (createTaskResponse.ok) {
                const taskId = taskData.id; // Captura o ID da tarefa retornada

                // Exibe o ID da tarefa criada
                //alert(`A tarefa foi criada com o ID: ${taskId}`);

                // Verifica se há um arquivo para upload
                if (inputFile) {
                    const fileUploadUrl = `https://api.clickup.com/api/v2/task/${taskId}/attachment`;
                    const fileUploadFormData = new FormData();
                    fileUploadFormData.append('attachment', inputFile);

                    // Realiza o upload do arquivo
                    const fileUploadResponse = await fetch(fileUploadUrl, {
                        method: 'POST',
                        headers: {
                            'Authorization': apiToken,
                        },
                        body: fileUploadFormData,
                    });

                    if (!fileUploadResponse.ok) {
                        console.error('Erro ao fazer upload do arquivo:', fileUploadResponse.statusText);
                        alert('Ocorreu um erro ao fazer o upload do arquivo.');
                        return;
                    }
                }

                // Redireciona após sucesso
                let redirectUrl = "https://s.tintim.app/whatsapp/2e283e57-acfe-416e-9eb6-20215c55aed2/826898e0-246e-4c8a-9fcb-7a25585ebc80";

                if (utmSource) {
                    redirectUrl += `?utm_source=${encodeURIComponent(utmSource)}`;
                    if (utmMedium) {
                        redirectUrl += `&utm_medium=${encodeURIComponent(utmMedium)}`;
                    }
                    if (utmCampaign) {
                        redirectUrl += `&utm_campaign=${encodeURIComponent(utmCampaign)}`;
                    }
                    if (utmContent) {
                        redirectUrl += `&utm_content=${encodeURIComponent(utmContent)}`;
                    }
                    if (utmTerm) {
                        redirectUrl += `&utm_term=${encodeURIComponent(utmTerm)}`;
                    }
                    if (gclid) {
                        redirectUrl += `&gclid=${encodeURIComponent(gclid)}`;
                    }
                    if (fbclid) {
                        redirectUrl += `&fbclid=${encodeURIComponent(fbclid)}`;
                    }
                }

                window.location.href = redirectUrl;
            } else {
                console.error('Erro ao criar tarefa:', createTaskResponse.statusText);
                alert('Ocorreu um erro ao criar a tarefa.');
            }
        } catch (error) {
            console.error('Erro na solicitação:', error);
            alert('Ocorreu um erro na solicitação. Tente novamente.');
        }
    });
});
</script>
