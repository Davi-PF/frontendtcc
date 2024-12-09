### Documentação RFC do projeto geral:
[Documentação Técnica RFC do projeto](https://docs.google.com/document/d/11Tobzwm5-JkiURC2DJRTKl8LARjj46NG/edit?usp=sharing&ouid=113156827946997430842&rtpof=true&sd=true)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Davi-PF_frontendtcc&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Davi-PF_frontendtcc)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Davi-PF_frontendtcc&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Davi-PF_frontendtcc)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Davi-PF_frontendtcc&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Davi-PF_frontendtcc)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Davi-PF_frontendtcc&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Davi-PF_frontendtcc)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Davi-PF_frontendtcc&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Davi-PF_frontendtcc)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Davi-PF_frontendtcc&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=Davi-PF_frontendtcc)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Davi-PF_frontendtcc&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Davi-PF_frontendtcc)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Davi-PF_frontendtcc&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Davi-PF_frontendtcc)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=Davi-PF_frontendtcc&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=Davi-PF_frontendtcc)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Davi-PF_frontendtcc&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Davi-PF_frontendtcc)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Davi-PF_frontendtcc&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Davi-PF_frontendtcc)

## ZLO Trackband - TPA

O **ZLO Trackband TPA** é um frontend dedicado a interação do Terceiro com a pulseira do Dependente, desenvolvido para que haja uma interação fluída e concisa com as informações do dependente, garantindo que situações emergenciais sejam resolvidas de maneira eficaz.

Essa parte funciona dependendo inicialmente de uma URL criptografada na pulseira que contém o chip NFC, a partir do acesso da URL é iniciado o fluxo do **ZLO Trackband TPA**.

## Aspectos Técnicos

Sabendo que esse projeto envolve diversas situações sensíveis, durante o desenvolvimento foi focado principalmente em como transparecer segurança aos usuários que viriam a utilizar o produto. Para o **ZLO Trackband TPA** não foi diferente, foram realizadas diversas abordagens para garantir que não haja vazamento desses dados sensíveis. Algumas delas são:

1. **Autenticação Baseada em JWT**:
   - A interação no **ZLO Trackband TPA** utiliza do Microserviço desenvolvido no contexto do projeto de extensão, onde é obtido um token JWT temporário que é assinado com uma chave secreta exclusiva, garantindo que as informações só sejam possíveis de serem obtidas a partir da aquisição do token.
   - Esse token JWT garante que o 'Terceiro' consiga interagir com a aplicação que por sua vez terá o token para repassar aos endpoints e garantir que os dados obtidos através deles, só sejam obtidos quando há um token válido.

2. **Armazenamento de dados Locais**:
   - Os dados necessários para o **ZLO Trackband TPA** são armazenados localmente, de maneira criptografada a partir do padrão AES garantindo que somente com a chave de decriptação específica seja possível acessar aqueles dados armazenados.

3. **Sistema de Notificações**:
   - Devido à lógica de negócio, foi integrado o serviço de notificação do Google, o Firebase Cloud Messaging (FCM), que é responsável por encaminhar notificações aos dispositivos dos responsáveis quando alguém realiza o scan do NFC de um de seus dependentes. Isso garante que os responsáveis sejam alertados a cada interação com a pulseira de seus dependentes.

4. **Histórico de Scans**:
   - Como as informações do dependente são informações delicadas, foi utilizado uma abordagem para saber quem escaneou, quando escaneou e onde escaneou. Essa interação depende que o terceiro que está prestando auxílio ao dependente, permita o acesso a localização momentânea e que ele forneça seu nome, e-mail e telefone. Estes que são utilizados para gerar o token JWT temporário, para que os fluxos funcionem.
   - Esse sistema também integra uma autenticação de dois fatores que faz uso do serviço do Twilio de envio de SMS, fazendo com que os dados informados pelo terceiro sejam válidos para ele conseguir prosseguir para a página onde estarão os dados mais sensíveis do dependente que ele está auxiliando.

---

## Desenvolvido por:

- Davi Prudente Ferreira.

## Wiki deste módulo

[Clique aqui para redirecionar para a Wiki](https://github.com/Davi-PF/frontendtcc/wiki/)
