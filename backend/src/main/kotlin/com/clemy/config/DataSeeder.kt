package com.clemy.config

import com.clemy.claim.ClaimEntity
import com.clemy.claim.ClaimRepository
import com.clemy.claim.SupplierRepository
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.temporal.ChronoUnit

@Component
class DataSeeder(
    private val claimRepository: ClaimRepository,
    private val supplierRepository: SupplierRepository
) : ApplicationRunner {

    override fun run(args: ApplicationArguments) {
        if (claimRepository.count() > 0) return

        val suppliers = supplierRepository.findAll()
        if (suppliers.isEmpty()) return

        val a = suppliers.find { it.name == "A업체" }
        val b = suppliers.find { it.name == "B업체" }
        val c = suppliers.find { it.name == "C업체" }

        val now = Instant.now()

        val seeds = listOf(
            // 소음 5개
            ClaimEntity(rawText = "3공정에서 이상한 소음이 계속 납니다. A업체 납품 부품 설치 후부터 생긴 것 같아요.", processName = "3공정", supplierId = a?.id, occurredAt = now.minus(1, ChronoUnit.DAYS), claimType = "소음", severity = "높음", rootCauseCandidates = """[{"rank":1,"cause":"납품 부품 불량","confidence":"높음"},{"rank":2,"cause":"설치 불량","confidence":"중간"},{"rank":3,"cause":"부품 마모","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 해당 부품 교체","priority":1},{"action":"단기: 납품 부품 전수 검사","priority":2},{"action":"장기: 공급업체 품질 감사","priority":3}]""", isRepeated = true, aiSummary = "A업체 납품 부품으로 인한 3공정 소음 발생, 반복 패턴 확인됨", status = "처리중"),
            ClaimEntity(rawText = "2공정 컨베이어 벨트에서 끼익거리는 소리가 납니다.", processName = "2공정", supplierId = b?.id, occurredAt = now.minus(3, ChronoUnit.DAYS), claimType = "소음", severity = "중간", rootCauseCandidates = """[{"rank":1,"cause":"벨트 장력 불균형","confidence":"높음"},{"rank":2,"cause":"롤러 베어링 마모","confidence":"중간"},{"rank":3,"cause":"이물질 끼임","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 이물질 제거 및 벨트 장력 점검","priority":1},{"action":"단기: 베어링 교체","priority":2},{"action":"장기: 정기 예방점검 주기 단축","priority":3}]""", isRepeated = false, aiSummary = "컨베이어 벨트 장력 불균형으로 인한 소음, 즉시 점검 필요", status = "접수됨"),
            ClaimEntity(rawText = "1공정 압착기에서 금속 마찰음이 발생합니다.", processName = "1공정", supplierId = a?.id, occurredAt = now.minus(5, ChronoUnit.DAYS), claimType = "소음", severity = "높음", rootCauseCandidates = """[{"rank":1,"cause":"압착 헤드 마모","confidence":"높음"},{"rank":2,"cause":"윤활유 부족","confidence":"중간"},{"rank":3,"cause":"이물질 혼입","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 윤활유 보충","priority":1},{"action":"단기: 압착 헤드 교체","priority":2},{"action":"장기: 윤활 자동화 시스템 도입","priority":3}]""", isRepeated = true, aiSummary = "압착기 마모로 인한 금속 마찰음, 반복 발생 중", status = "완료"),
            ClaimEntity(rawText = "야간 작업 중 4공정에서 간헐적 소음이 납니다.", processName = "4공정", supplierId = c?.id, occurredAt = now.minus(7, ChronoUnit.DAYS), claimType = "소음", severity = "낮음", rootCauseCandidates = """[{"rank":1,"cause":"온도 변화로 인한 열팽창","confidence":"높음"},{"rank":2,"cause":"체결 볼트 이완","confidence":"중간"},{"rank":3,"cause":"진동 공명","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 볼트 체결 상태 확인","priority":1},{"action":"단기: 방진 패드 추가","priority":2},{"action":"장기: 야간 온도 관리 강화","priority":3}]""", isRepeated = false, aiSummary = "야간 온도 변화로 인한 간헐적 소음, 볼트 점검 권고", status = "접수됨"),
            ClaimEntity(rawText = "5공정 모터에서 진동과 함께 소음이 발생합니다.", processName = "5공정", supplierId = b?.id, occurredAt = now.minus(10, ChronoUnit.DAYS), claimType = "소음", severity = "높음", rootCauseCandidates = """[{"rank":1,"cause":"모터 베어링 불량","confidence":"높음"},{"rank":2,"cause":"불균형 회전체","confidence":"중간"},{"rank":3,"cause":"전원 불안정","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 모터 가동 중단 및 점검","priority":1},{"action":"단기: 베어링 교체","priority":2},{"action":"장기: 모터 주기적 진단 체계 수립","priority":3}]""", isRepeated = true, aiSummary = "5공정 모터 베어링 불량, 즉시 가동 중단 필요", status = "처리중"),

            // 납품지연 4개
            ClaimEntity(rawText = "A업체 납품 예정일이 3일 지났는데 아직 물량이 도착하지 않았습니다.", supplierId = a?.id, occurredAt = now.minus(2, ChronoUnit.DAYS), claimType = "납품지연", severity = "높음", rootCauseCandidates = """[{"rank":1,"cause":"공급업체 생산 차질","confidence":"높음"},{"rank":2,"cause":"물류 지연","confidence":"중간"},{"rank":3,"cause":"통관 지연","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 업체 담당자에게 납품 일정 확인","priority":1},{"action":"단기: 대체 업체 긴급 발주","priority":2},{"action":"장기: 납품업체 이중화","priority":3}]""", isRepeated = true, aiSummary = "A업체 납품 3일 지연, 대체 공급 검토 필요", status = "처리중"),
            ClaimEntity(rawText = "B업체 부품이 이번 달만 두 번째 지연입니다.", supplierId = b?.id, occurredAt = now.minus(4, ChronoUnit.DAYS), claimType = "납품지연", severity = "중간", rootCauseCandidates = """[{"rank":1,"cause":"B업체 생산능력 부족","confidence":"높음"},{"rank":2,"cause":"원자재 수급 불안정","confidence":"중간"},{"rank":3,"cause":"내부 품질 불합격","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 긴급 납품 요청","priority":1},{"action":"단기: B업체 생산 계획 공유 요청","priority":2},{"action":"장기: 납품 업체 다변화","priority":3}]""", isRepeated = true, aiSummary = "B업체 반복 납품 지연, 업체 역량 검토 필요", status = "접수됨"),
            ClaimEntity(rawText = "C업체에서 수량 부족으로 부분 납품했습니다. 잔여분 일정 미정.", supplierId = c?.id, occurredAt = now.minus(6, ChronoUnit.DAYS), claimType = "납품지연", severity = "중간", rootCauseCandidates = """[{"rank":1,"cause":"발주 수량 오류","confidence":"높음"},{"rank":2,"cause":"재고 부족","confidence":"중간"},{"rank":3,"cause":"포장 불량으로 인한 재작업","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 잔여 납품 일정 확정 요청","priority":1},{"action":"단기: 발주서 재확인","priority":2},{"action":"장기: 수발주 시스템 연동 도입","priority":3}]""", isRepeated = false, aiSummary = "C업체 수량 부족 부분납품, 잔여분 일정 확보 필요", status = "접수됨"),
            ClaimEntity(rawText = "납품 트럭이 공장 도착 후 검수 중 규격 불일치로 반송됐습니다.", supplierId = a?.id, occurredAt = now.minus(9, ChronoUnit.DAYS), claimType = "납품지연", severity = "높음", rootCauseCandidates = """[{"rank":1,"cause":"규격서 버전 불일치","confidence":"높음"},{"rank":2,"cause":"검수 기준 변경 미전달","confidence":"중간"},{"rank":3,"cause":"제조 오류","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 규격서 최신본 공유","priority":1},{"action":"단기: 재납품 일정 조율","priority":2},{"action":"장기: 납품 전 사전 검수 절차 도입","priority":3}]""", isRepeated = false, aiSummary = "규격 불일치로 납품 반송, 규격서 관리 체계 개선 필요", status = "완료"),

            // 품질불량 3개
            ClaimEntity(rawText = "이번 배치 부품 표면에 스크래치가 다수 발견됩니다.", processName = "입고검수", supplierId = b?.id, occurredAt = now.minus(2, ChronoUnit.DAYS), claimType = "품질불량", severity = "중간", rootCauseCandidates = """[{"rank":1,"cause":"포장 불량","confidence":"높음"},{"rank":2,"cause":"운반 중 충격","confidence":"중간"},{"rank":3,"cause":"제조 공정 이상","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 해당 배치 전수 검사","priority":1},{"action":"단기: 포장 기준 강화 요청","priority":2},{"action":"장기: 입고 품질 기준 문서화","priority":3}]""", isRepeated = false, aiSummary = "표면 스크래치 다수 발견, 포장 불량 가능성 높음", status = "처리중"),
            ClaimEntity(rawText = "치수 공차가 도면 기준을 벗어난 부품이 섞여 있습니다.", processName = "조립", supplierId = c?.id, occurredAt = now.minus(8, ChronoUnit.DAYS), claimType = "품질불량", severity = "높음", rootCauseCandidates = """[{"rank":1,"cause":"가공 설비 교정 불량","confidence":"높음"},{"rank":2,"cause":"작업자 오류","confidence":"중간"},{"rank":3,"cause":"측정 기구 불량","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 불량품 격리 및 출하 중단","priority":1},{"action":"단기: 설비 교정 실시","priority":2},{"action":"장기: SPC 도입으로 실시간 모니터링","priority":3}]""", isRepeated = true, aiSummary = "치수 공차 초과, 가공 설비 교정 즉시 필요", status = "완료"),
            ClaimEntity(rawText = "도장 색상이 표준 색상과 다르게 납품됐습니다.", processName = "도장", supplierId = a?.id, occurredAt = now.minus(12, ChronoUnit.DAYS), claimType = "품질불량", severity = "낮음", rootCauseCandidates = """[{"rank":1,"cause":"도료 배합 오류","confidence":"높음"},{"rank":2,"cause":"색상 기준서 미준수","confidence":"중간"},{"rank":3,"cause":"도료 로트 변경","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 색상 기준서 재공유","priority":1},{"action":"단기: 재도장 처리","priority":2},{"action":"장기: 색차계 도입으로 출하 검사 강화","priority":3}]""", isRepeated = false, aiSummary = "도장 색상 불일치, 도료 배합 재확인 필요", status = "완료"),

            // 냄새 2개
            ClaimEntity(rawText = "2공정 근처에서 화학약품 냄새가 납니다. 작업자들이 두통을 호소합니다.", processName = "2공정", supplierId = b?.id, occurredAt = now.minus(1, ChronoUnit.DAYS), claimType = "냄새", severity = "높음", rootCauseCandidates = """[{"rank":1,"cause":"세척제 누출","confidence":"높음"},{"rank":2,"cause":"환기 시스템 고장","confidence":"중간"},{"rank":3,"cause":"인근 공정 화학물질 누출","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 작업 중단 및 환기","priority":1},{"action":"단기: 누출 부위 확인 및 수리","priority":2},{"action":"장기: 환기 시스템 정기 점검 주기 수립","priority":3}]""", isRepeated = false, aiSummary = "화학약품 냄새로 작업자 건강 위협, 즉시 작업 중단 필요", status = "처리중"),
            ClaimEntity(rawText = "납품된 고무 패킹에서 이상한 냄새가 납니다. 원료 문제인지 확인 필요.", processName = "입고검수", supplierId = c?.id, occurredAt = now.minus(14, ChronoUnit.DAYS), claimType = "냄새", severity = "중간", rootCauseCandidates = """[{"rank":1,"cause":"원자재 품질 이상","confidence":"높음"},{"rank":2,"cause":"보관 중 변질","confidence":"중간"},{"rank":3,"cause":"제조 공정 오염","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 해당 로트 격리","priority":1},{"action":"단기: 성분 분석 의뢰","priority":2},{"action":"장기: 수입 원자재 검사 강화","priority":3}]""", isRepeated = false, aiSummary = "고무 패킹 이상 냄새, 원자재 품질 분석 필요", status = "완료"),

            // 진동 1개
            ClaimEntity(rawText = "6공정 프레스 작동 시 바닥 전체가 진동합니다. 인근 정밀 장비에 영향이 있습니다.", processName = "6공정", supplierId = a?.id, occurredAt = now.minus(3, ChronoUnit.DAYS), claimType = "진동", severity = "높음", rootCauseCandidates = """[{"rank":1,"cause":"방진 패드 노후화","confidence":"높음"},{"rank":2,"cause":"기초 앵커 이완","confidence":"중간"},{"rank":3,"cause":"프레스 불균형","confidence":"낮음"}]""", recommendations = """[{"action":"즉시: 인근 정밀 장비 이격","priority":1},{"action":"단기: 방진 패드 교체","priority":2},{"action":"장기: 기초 보강 공사 계획 수립","priority":3}]""", isRepeated = false, aiSummary = "6공정 프레스 진동이 인근 장비에 영향, 방진 패드 즉시 점검", status = "처리중")
        )

        claimRepository.saveAll(seeds)
    }
}
