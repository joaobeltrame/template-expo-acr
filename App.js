import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';

export default function App() {
  // ==================== ESTADOS ====================
  
  // Controle de autenticação
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [inputUsuario, setInputUsuario] = useState('');
  const [inputSenha, setInputSenha] = useState('');
  
  // Controle de navegação entre telas
  const [telaAtual, setTelaAtual] = useState('Home');
  
  // Lista de serviços cadastrados
  const [servicos, setServicos] = useState([
    {
      id: 1,
      cliente: 'Maria Silva',
      telefone: '(48) 99999-1111',
      tipoServico: 'Instalação de Ar Condicionado',
      valor: 1500,
      data: '2026-06-15',
      status: 'Pendente'
    },
    {
      id: 2,
      cliente: 'João Santos',
      telefone: '(48) 99999-2222',
      tipoServico: 'Manutenção Preventiva',
      valor: 350,
      data: '2026-06-10',
      status: 'Concluído'
    },
    {
      id: 3,
      cliente: 'Ana Costa',
      telefone: '(48) 99999-3333',
      tipoServico: 'Limpeza de Split',
      valor: 200,
      data: '2026-06-20',
      status: 'Pendente'
    }
  ]);
  
  // Campos do formulário de agendamento
  const [novoCliente, setNovoCliente] = useState('');
  const [novoTelefone, setNovoTelefone] = useState('');
  const [novoTipoServico, setNovoTipoServico] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [novaData, setNovaData] = useState('');

  // ==================== FUNÇÕES ====================
  
  // Função de login
  const realizarLogin = () => {
    if (inputUsuario === 'admin' && inputSenha === '123') {
      setUsuarioLogado(true);
      setTelaAtual('Home');
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos!');
    }
  };

  // Função para salvar novo serviço
  const salvarServico = () => {
    // Validação dos campos
    if (!novoCliente || !novoTelefone || !novoTipoServico || !novoValor || !novaData) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos!');
      return;
    }

    // Criação do novo serviço
    const novoServico = {
      id: servicos.length + 1,
      cliente: novoCliente,
      telefone: novoTelefone,
      tipoServico: novoTipoServico,
      valor: parseFloat(novoValor),
      data: novaData,
      status: 'Pendente'
    };

    // Adiciona o serviço à lista
    setServicos([...servicos, novoServico]);

    // Limpa os campos do formulário
    setNovoCliente('');
    setNovoTelefone('');
    setNovoTipoServico('');
    setNovoValor('');
    setNovaData('');

    Alert.alert('Sucesso', 'Serviço agendado com sucesso!');
    setTelaAtual('Lista');
  };

  // Função para alterar status do serviço
  const alterarStatus = (id) => {
    setServicos(servicos.map(servico => {
      if (servico.id === id) {
        return {
          ...servico,
          status: servico.status === 'Pendente' ? 'Concluído' : 'Pendente'
        };
      }
      return servico;
    }));
  };

  // Função para excluir serviço
  const excluirServico = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir este serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: () => {
            setServicos(servicos.filter(servico => servico.id !== id));
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Cálculo dos indicadores financeiros
  const servicosPendentes = servicos.filter(s => s.status === 'Pendente');
  const servicosConcluidos = servicos.filter(s => s.status === 'Concluído');
  
  const faturamentoPrevisto = servicosPendentes.reduce((total, s) => total + s.valor, 0);
  const faturamentoRecebido = servicosConcluidos.reduce((total, s) => total + s.valor, 0);
  const totalGeral = faturamentoPrevisto + faturamentoRecebido;

  // ==================== TELA DE LOGIN ====================
  
  if (!usuarioLogado) {
    return (
      <View style={styles.loginContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
        <View style={styles.loginCard}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>AC/R</Text>
            <Text style={styles.logoSubtext}>Climatização</Text>
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Usuário"
            placeholderTextColor="#999"
            value={inputUsuario}
            onChangeText={setInputUsuario}
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#999"
            value={inputSenha}
            onChangeText={setInputSenha}
            secureTextEntry
          />
          
          <TouchableOpacity style={styles.btnLogin} onPress={realizarLogin}>
            <Text style={styles.btnLoginText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ==================== TELA HOME ====================
  
  if (telaAtual === 'Home') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>AC/R Climatização</Text>
        </View>

        <ScrollView style={styles.content}>
          {/* Cards de Serviços */}
          <View style={styles.row}>
            <View style={[styles.cardHome, styles.cardPendente]}>
              <Text style={styles.cardNumber}>{servicosPendentes.length}</Text>
              <Text style={styles.cardLabel}>Serviços Pendentes</Text>
            </View>
            
            <View style={[styles.cardHome, styles.cardConcluido]}>
              <Text style={styles.cardNumber}>{servicosConcluidos.length}</Text>
              <Text style={styles.cardLabel}>Serviços Concluídos</Text>
            </View>
          </View>

          {/* Cards Financeiros */}
          <View style={styles.cardFinanceiro}>
            <Text style={styles.cardFinanceiroTitle}>💰 Faturamento Previsto</Text>
            <Text style={styles.cardFinanceiroValor}>
              R$ {faturamentoPrevisto.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <View style={styles.cardFinanceiro}>
            <Text style={styles.cardFinanceiroTitle}>✅ Faturamento Recebido</Text>
            <Text style={styles.cardFinanceiroValor}>
              R$ {faturamentoRecebido.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <View style={[styles.cardFinanceiro, styles.cardTotal]}>
            <Text style={styles.cardFinanceiroTitle}>📊 Total Geral</Text>
            <Text style={[styles.cardFinanceiroValor, styles.valorTotal]}>
              R$ {totalGeral.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </ScrollView>

        {/* Menu Inferior */}
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Home')}>
            <Text style={styles.menuBtnTextActive}>🏠 Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Agendar')}>
            <Text style={styles.menuBtnText}>📅 Agendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Lista')}>
            <Text style={styles.menuBtnText}>📋 Lista</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Financeiro')}>
            <Text style={styles.menuBtnText}>💵 Financeiro</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ==================== TELA AGENDAR SERVIÇO ====================
  
  if (telaAtual === 'Agendar') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Agendar Serviço</Text>
          <Text style={styles.headerSubtitle}>Cadastre um novo serviço</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.form}>
            <Text style={styles.label}>Nome do Cliente</Text>
            <TextInput
              style={styles.inputForm}
              placeholder="Digite o nome completo"
              value={novoCliente}
              onChangeText={setNovoCliente}
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.inputForm}
              placeholder="(00) 00000-0000"
              value={novoTelefone}
              onChangeText={setNovoTelefone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Tipo de Serviço</Text>
            <TextInput
              style={styles.inputForm}
              placeholder="Ex: Instalação, Manutenção, Limpeza"
              value={novoTipoServico}
              onChangeText={setNovoTipoServico}
            />

            <Text style={styles.label}>Valor (R$)</Text>
            <TextInput
              style={styles.inputForm}
              placeholder="0.00"
              value={novoValor}
              onChangeText={setNovoValor}
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Data do Serviço</Text>
            <TextInput
              style={styles.inputForm}
              placeholder="AAAA-MM-DD"
              value={novaData}
              onChangeText={setNovaData}
            />

            <TouchableOpacity style={styles.btnSalvar} onPress={salvarServico}>
              <Text style={styles.btnSalvarText}>💾 Salvar Serviço</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Home')}>
            <Text style={styles.menuBtnText}>🏠 Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Agendar')}>
            <Text style={styles.menuBtnTextActive}>📅 Agendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Lista')}>
            <Text style={styles.menuBtnText}>📋 Lista</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Financeiro')}>
            <Text style={styles.menuBtnText}>💵 Financeiro</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ==================== TELA LISTA DE SERVIÇOS ====================
  
  if (telaAtual === 'Lista') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lista de Serviços</Text>
          <Text style={styles.headerSubtitle}>{servicos.length} serviços cadastrados</Text>
        </View>

        <ScrollView style={styles.content}>
          {servicos.map((servico) => (
            <View key={servico.id} style={styles.cardServico}>
              <View style={styles.cardServicoHeader}>
                <Text style={styles.cardServicoCliente}>{servico.cliente}</Text>
                <View style={[
                  styles.badge,
                  servico.status === 'Pendente' ? styles.badgePendente : styles.badgeConcluido
                ]}>
                  <Text style={styles.badgeText}>{servico.status}</Text>
                </View>
              </View>

              <Text style={styles.cardServicoInfo}>📞 {servico.telefone}</Text>
              <Text style={styles.cardServicoInfo}>🔧 {servico.tipoServico}</Text>
              <Text style={styles.cardServicoInfo}>
                💰 R$ {servico.valor.toFixed(2).replace('.', ',')}
              </Text>
              <Text style={styles.cardServicoInfo}>📅 {servico.data}</Text>

              <View style={styles.cardServicoActions}>
                <TouchableOpacity
                  style={styles.btnStatus}
                  onPress={() => alterarStatus(servico.id)}
                >
                  <Text style={styles.btnStatusText}>Alterar Status</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnExcluir}
                  onPress={() => excluirServico(servico.id)}
                >
                  <Text style={styles.btnExcluirText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Home')}>
            <Text style={styles.menuBtnText}>🏠 Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Agendar')}>
            <Text style={styles.menuBtnText}>📅 Agendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Lista')}>
            <Text style={styles.menuBtnTextActive}>📋 Lista</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Financeiro')}>
            <Text style={styles.menuBtnText}>💵 Financeiro</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ==================== TELA FINANCEIRO ====================
  
  if (telaAtual === 'Financeiro') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0D47A1" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Financeiro</Text>
          <Text style={styles.headerSubtitle}>Gestão de faturamento</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.cardFinanceiroGrande}>
            <Text style={styles.cardFinanceiroGrandeTitulo}>💰 Faturamento Previsto</Text>
            <Text style={styles.cardFinanceiroGrandeSubtitulo}>
              Serviços pendentes de pagamento
            </Text>
            <Text style={styles.cardFinanceiroGrandeValor}>
              R$ {faturamentoPrevisto.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={styles.cardFinanceiroGrandeInfo}>
              {servicosPendentes.length} serviços pendentes
            </Text>
          </View>

          <View style={styles.cardFinanceiroGrande}>
            <Text style={styles.cardFinanceiroGrandeTitulo}>✅ Faturamento Recebido</Text>
            <Text style={styles.cardFinanceiroGrandeSubtitulo}>
              Serviços já pagos
            </Text>
            <Text style={[styles.cardFinanceiroGrandeValor, { color: '#10B981' }]}>
              R$ {faturamentoRecebido.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={styles.cardFinanceiroGrandeInfo}>
              {servicosConcluidos.length} serviços concluídos
            </Text>
          </View>

          <View style={[styles.cardFinanceiroGrande, { backgroundColor: '#0D47A1' }]}>
            <Text style={[styles.cardFinanceiroGrandeTitulo, { color: '#FFF' }]}>
              📊 Total Geral
            </Text>
            <Text style={[styles.cardFinanceiroGrandeSubtitulo, { color: '#E0E7FF' }]}>
              Soma de todos os serviços
            </Text>
            <Text style={[styles.cardFinanceiroGrandeValor, { color: '#FFF', fontSize: 42 }]}>
              R$ {totalGeral.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={[styles.cardFinanceiroGrandeInfo, { color: '#E0E7FF' }]}>
              {servicos.length} serviços cadastrados
            </Text>
          </View>
        </ScrollView>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Home')}>
            <Text style={styles.menuBtnText}>🏠 Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Agendar')}>
            <Text style={styles.menuBtnText}>📅 Agendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Lista')}>
            <Text style={styles.menuBtnText}>📋 Lista</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setTelaAtual('Financeiro')}>
            <Text style={styles.menuBtnTextActive}>💵 Financeiro</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// ==================== ESTILOS ====================

const styles = StyleSheet.create({
  // Estilos da tela de login
  loginContainer: {
    flex: 1,
    backgroundColor: '#0D47A1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0D47A1',
    letterSpacing: 2,
  },
  logoSubtext: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  btnLogin: {
    backgroundColor: '#0D47A1',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  btnLoginText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Estilos gerais
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#0D47A1',
    padding: 20,
    paddingTop: 50,
    paddingBottom: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },

  // Estilos da Home
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardHome: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  cardPendente: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  cardConcluido: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  cardNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  cardLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  cardFinanceiro: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardFinanceiroTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  cardFinanceiroValor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  cardTotal: {
    backgroundColor: '#0D47A1',
  },
  valorTotal: {
    color: '#FFF',
  },

  // Estilos do formulário
  form: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  inputForm: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  btnSalvar: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 25,
  },
  btnSalvarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Estilos da lista de serviços
  cardServico: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardServicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardServicoCliente: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D47A1',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgePendente: {
    backgroundColor: '#FEF3C7',
  },
  badgeConcluido: {
    backgroundColor: '#D1FAE5',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  cardServicoInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cardServicoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  btnStatus: {
    flex: 1,
    backgroundColor: '#0D47A1',
    borderRadius: 8,
    padding: 10,
    marginRight: 5,
    alignItems: 'center',
  },
  btnStatusText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnExcluir: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 10,
    marginLeft: 5,
    alignItems: 'center',
  },
  btnExcluirText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Estilos do financeiro
  cardFinanceiroGrande: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 25,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardFinanceiroGrandeTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardFinanceiroGrandeSubtitulo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  cardFinanceiroGrandeValor: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 10,
  },
  cardFinanceiroGrandeInfo: {
    fontSize: 14,
    color: '#999',
  },

  // Menu inferior
  menu: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  menuBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuBtnText: {
    fontSize: 12,
    color: '#999',
  },
  menuBtnTextActive: {
    fontSize: 12,
    color: '#0D47A1',
    fontWeight: 'bold',
  },
});
