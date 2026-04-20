// Interfaces para o Pagamento
export interface Pagamento {
    uuid: string;
    parcelas_pagamento?: number;
    id_metodos_de_pagamento: number;
    codigo_do_pagamento: string;
    pedido_uuid_pedido: string;
    id_status_pagamento: number;
    uuid_recibo_pagamento: number;
    nfe_pagamento: string;
}