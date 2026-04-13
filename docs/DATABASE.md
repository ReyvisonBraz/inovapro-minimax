# Documentação do Banco de Dados - FINANCEIRO INOVA

**Versão:** 1.0  
**Data:** 2026-04-13  
**Banco:** SQLite (finance.db)

---

## Visão Geral

O projeto utiliza SQLite como banco de dados local. O schema Prisma está configurado para SQLite (`provider = "sqlite"`).

---

## Tabelas

### users

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| username | TEXT | Unique, nome de usuário |
| password | TEXT | Hash bcrypt |
| role | TEXT | 'owner', 'manager' ou 'employee' |
| name | TEXT | Nome completo |
| permissions | TEXT | JSON array de permissões |
| createdAt | DATETIME | Data de criação |

### transactions

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| description | TEXT | Descrição da transação |
| category | TEXT | Categoria |
| type | TEXT | 'income' ou 'expense' |
| amount | REAL | Valor |
| date | TEXT | Data (ISO 8601) |
| status | TEXT | Padrão: 'Concluído' |
| createdBy | INTEGER | FK → users.id (opcional) |
| updatedBy | INTEGER | FK → users.id (opcional) |
| paymentId | INTEGER | FK → client_payments.id (opcional) |
| saleId | TEXT | Para links de vendas futuras |

### customers

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| firstName | TEXT | Nome |
| lastName | TEXT | Sobrenome |
| nickname | TEXT | Apelido (opcional) |
| cpf | TEXT | CPF (opcional) |
| companyName | TEXT | Nome da empresa (opcional) |
| phone | TEXT | Telefone |
| observation | TEXT | Observações (opcional) |
| creditLimit | REAL | Limite de crédito (padrão: 0) |
| createdAt | DATETIME | Data de criação |
| createdBy | INTEGER | FK → users.id (opcional) |
| updatedBy | INTEGER | FK → users.id (opcional) |

### client_payments

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| customerId | INTEGER | FK → customers.id |
| description | TEXT | Descrição |
| totalAmount | REAL | Valor total |
| paidAmount | REAL | Valor pago (padrão: 0) |
| purchaseDate | TEXT | Data da compra |
| dueDate | TEXT | Data de vencimento |
| paymentMethod | TEXT | Método de pagamento |
| status | TEXT | 'pending', 'partial', 'paid' |
| installmentsCount | INTEGER | Número de parcelas |
| type | TEXT | 'income' ou 'expense' |
| saleId | TEXT | ID da venda (opcional) |
| paymentHistory | TEXT | JSON array com histórico |
| createdBy | INTEGER | FK → users.id (opcional) |
| updatedBy | INTEGER | FK → users.id (opcional) |

### service_orders

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| customerId | INTEGER | FK → customers.id |
| equipmentType | TEXT | Tipo de equipamento |
| equipmentBrand | TEXT | Marca |
| equipmentModel | TEXT | Modelo |
| equipmentColor | TEXT | Cor |
| equipmentSerial | TEXT | Número de série |
| reportedProblem | TEXT | Problema relatado |
| arrivalPhotoUrl | TEXT | URL da foto (opcional) |
| arrivalPhotoBase64 | TEXT | Foto em base64 |
| status | TEXT | Status (padrão: 'Aguardando Análise') |
| technicalAnalysis | TEXT | Análise técnica |
| servicesPerformed | TEXT | Serviços realizados |
| services | TEXT | JSON array de serviços |
| partsUsed | TEXT | JSON array de peças |
| serviceFee | REAL | Taxa de serviço |
| totalAmount | REAL | Valor total |
| finalObservations | TEXT | Observações finais |
| entryDate | TEXT | Data de entrada |
| analysisPrediction | TEXT | Previsão/análise |
| customerPassword | TEXT | Senha do cliente |
| accessories | TEXT | Acessórios |
| ramInfo | TEXT | Info da RAM |
| ssdInfo | TEXT | Info do SSD |
| priority | TEXT | 'low', 'medium', 'high', 'urgent' |
| createdAt | DATETIME | Data de criação |
| createdBy | INTEGER | FK → users.id (opcional) |
| updatedBy | INTEGER | FK → users.id (opcional) |

### inventory_items

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| name | TEXT | Nome do item |
| category | TEXT | 'product' ou 'service' |
| sku | TEXT | SKU (opcional) |
| unitPrice | REAL | Preço unitário |
| costPrice | REAL | Preço de custo |
| salePrice | REAL | Preço de venda |
| quantity | INTEGER | Quantidade em estoque |
| minQuantity | INTEGER | Quantidade mínima |
| stockLevel | INTEGER | Nível de estoque |
| createdAt | DATETIME | Data de criação |
| createdBy | INTEGER | FK → users.id (opcional) |
| updatedBy | INTEGER | FK → users.id (opcional) |

### categories

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| name | TEXT | Nome da categoria |
| type | TEXT | 'income' ou 'expense' |

### settings

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK, default 1 |
| appName | TEXT | Nome do app |
| appVersion | TEXT | Versão |
| fiscalYear | TEXT | Ano fiscal |
| primaryColor | TEXT | Cor primária (#hex) |
| categories | TEXT | Categorias separadas por vírgula |
| incomeCategories | TEXT | Categorias de receita |
| expenseCategories | TEXT | Categorias de despesa |
| profileName | TEXT | Nome do perfil |
| profileAvatar | TEXT | Avatar URL |
| initialBalance | REAL | Saldo inicial |
| showWarnings | INTEGER | Mostrar avisos (0/1) |
| hiddenColumns | TEXT | JSON array |
| settingsPassword | TEXT | Senha das configurações |
| receiptLayout | TEXT | 'a4' ou 'thermal' |
| receiptLogo | TEXT | Logo (base64) |
| companyCnpj | TEXT | CNPJ |
| companyAddress | TEXT | Endereço |
| pixKey | TEXT | Chave PIX |
| pixQrCode | TEXT | QR Code PIX |
| whatsappBillingTemplate | TEXT | Template WhatsApp cobrança |
| whatsappOSTemplate | TEXT | Template WhatsApp OS |
| sendPulseClientId | TEXT | SendPulse Client ID |
| sendPulseClientSecret | TEXT | SendPulse Client Secret |
| sendPulseTemplateId | TEXT | SendPulse Template ID |

### audit_logs

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| userId | INTEGER | FK → users.id (opcional) |
| action | TEXT | Ação realizada |
| entity | TEXT | Entidade afetada |
| entityId | INTEGER | ID da entidade |
| details | TEXT | Detalhes |
| timestamp | DATETIME | Data/hora |

### service_order_statuses

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| name | TEXT | Nome do status |
| color | TEXT | Cor hex |
| priority | INTEGER | Prioridade |
| isDefault | INTEGER | É padrão (0/1) |

### brands

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| name | TEXT | Nome único |
| equipmentType | TEXT | Tipo de equipamento |

### models

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| brandId | INTEGER | FK → brands.id |
| name | TEXT | Nome do modelo |

**Unique:** [brandId, name]

### equipment_types

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| name | TEXT | Nome único |
| icon | TEXT | Ícone (opcional) |

### receipts

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | PK, autoincrement |
| paymentId | INTEGER | FK → client_payments.id |
| content | TEXT | Conteúdo do recibo |
| createdAt | DATETIME | Data de criação |

---

## Índices

O SQLite cria índices automaticamente para:
- PRIMARY KEY de todas as tabelas
- UNIQUE constraints (username, brand.name, etc.)

Índices customizados podem ser adicionados conforme necessário.

---

## Notas

1. **Transações e Pagamentos**: A coluna `paymentId` em `transactions` linking para `client_payments` permite rastrear qual transação pertence a qual pagamento.

2. **Serviços em OS**: A coluna `services` em `service_orders` é um JSON array que armazena os serviços realizados.

3. **Senhas**: Todas as senhas são armazenadas como hash bcrypt.

4. **Auditoria**: A tabela `audit_logs` registra todas as ações importantes com timestamp.
