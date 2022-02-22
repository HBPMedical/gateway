import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { IncomingMessage } from 'http';
import { Observable } from 'rxjs';
import { ENGINE_MODULE_OPTIONS } from 'src/engine/engine.constants';
import { IEngineOptions, IEngineService } from 'src/engine/engine.interfaces';
import { Domain } from 'src/engine/models/domain.model';
import { Algorithm } from 'src/engine/models/experiment/algorithm.model';
import {
  Experiment,
  PartialExperiment,
} from 'src/engine/models/experiment/experiment.model';
import { ExperimentCreateInput } from 'src/engine/models/experiment/input/experiment-create.input';
import { ExperimentEditInput } from 'src/engine/models/experiment/input/experiment-edit.input';
import { ListExperiments } from 'src/engine/models/experiment/list-experiments.model';

const test: Domain = {
  id: 'sophia',
  datasets: [
    {
      id: 'server1',
      label: 'server1',
    },
    {
      id: 'server2',
      label: 'server2',
    },
  ],
  rootGroup: {
    id: 'rootGroup',
    label: 'Root group',
    groups: ['measurement', 'observation', 'person', 'cohorts'],
  },
  groups: [
    {
      id: 'measurement',
      label: 'measurement',
      variables: [
        'Alanine.aminotransferase..Enzymatic.activity.volume..in.Serum.or.Plasma',
        'Albumin..Mass.volume..in.Serum.or.Plasma',
        'Alkaline.phosphatase..Enzymatic.activity.volume..in.Serum.or.Plasma',
        'American.house.dust.mite.IgE.Ab..Units.volume..in.Serum',
        'Aspartate.aminotransferase..Enzymatic.activity.volume..in.Serum.or.Plasma',
        'Basophils....volume..in.Blood.by.Automated.count',
        'Basophils.100.leukocytes.in.Blood.by.Automated.count',
        'Bicarbonate..Moles.volume..in.Arterial.blood',
        'Bilirubin.total..Mass.volume..in.Serum.or.Plasma',
        'Bilirubin.total..Mass.volume..in.Urine.by.Test.strip',
        'Body.height',
        'Body.mass.index..BMI...Percentile..Per.age.and.sex',
        'Body.mass.index..BMI...Ratio.',
        'Body.temperature',
        'Body.weight',
        'C.reactive.protein..Mass.volume..in.Serum.or.Plasma',
        'Calcium..Mass.volume..in.Blood',
        'Calcium..Mass.volume..in.Serum.or.Plasma',
        'Carbon.dioxide..Partial.pressure..in.Arterial.blood',
        'Carbon.dioxide..total..Moles.volume..in.Blood',
        'Carbon.dioxide..total..Moles.volume..in.Serum.or.Plasma',
        'Cat.dander.IgE.Ab..Units.volume..in.Serum',
        'Chloride..Moles.volume..in.Blood',
        'Chloride..Moles.volume..in.Serum.or.Plasma',
        'Cholesterol..Mass.volume..in.Serum.or.Plasma',
        'Cholesterol.in.HDL..Mass.volume..in.Serum.or.Plasma',
        'Cholesterol.in.LDL..Mass.volume..in.Serum.or.Plasma.by.Direct.assay',
        'Cladosporium.herbarum.IgE.Ab..Units.volume..in.Serum',
        'Codfish.IgE.Ab..Units.volume..in.Serum',
        'Common.Ragweed.IgE.Ab..Units.volume..in.Serum',
        'Cow.milk.IgE.Ab..Units.volume..in.Serum',
        'Creatine.kinase..Enzymatic.activity.volume..in.Serum.or.Plasma',
        'Creatinine..Mass.volume..in.Blood',
        'Creatinine..Mass.volume..in.Serum.or.Plasma',
        'Diastolic.blood.pressure',
        'DXA.Radius.and.Ulna..T.score..Bone.density',
        'Egg.white.IgE.Ab..Units.volume..in.Serum',
        'Eosinophils....volume..in.Blood.by.Automated.count',
        'Eosinophils.100.leukocytes.in.Blood.by.Automated.count',
        'Erythrocyte.distribution.width..Entitic.volume..by.Automated.count',
        'Erythrocyte.distribution.width..Ratio..by.Automated.count',
        'Erythrocytes....volume..in.Blood.by.Automated.count',
        'Ferritin..Mass.volume..in.Serum.or.Plasma',
        'FEV1.FVC',
        'Fibrin.D.dimer.FEU..Mass.volume..in.Platelet.poor.plasma',
        'Globulin..Mass.volume..in.Serum.by.calculation',
        'Glomerular.filtration.rate.1.73.sq.M.predicted..Volume.Rate.Area..in.Serum..Plasma.or.Blood.by.Creatinine.based.formula..MDRD.',
        'Glucose..Mass.volume..in.Blood',
        'Glucose..Mass.volume..in.Serum.or.Plasma',
        'Glucose..Mass.volume..in.Urine.by.Test.strip',
        'Head.Occipital.frontal.circumference',
        'Heart.rate',
        'Hematocrit..Volume.Fraction..of.Blood',
        'Hematocrit..Volume.Fraction..of.Blood.by.Automated.count',
        'Hemoglobin..Mass.volume..in.Blood',
        'Hemoglobin.A1c.Hemoglobin.total.in.Blood',
        'Hemoglobin.gastrointestinal.lower..Presence..in.Stool.by.Immunoassay...1st.specimen',
        'Honey.bee.IgE.Ab..Units.volume..in.Serum',
        'INR.in.Platelet.poor.plasma.by.Coagulation.assay',
        'Ketones..Mass.volume..in.Urine.by.Test.strip',
        'Lactate.dehydrogenase..Enzymatic.activity.volume..in.Serum.or.Plasma.by.Lactate.to.pyruvate.reaction',
        'Latex.IgE.Ab..Units.volume..in.Serum',
        'Left.ventricular.Ejection.fraction',
        'Leukocytes....volume..in.Blood.by.Automated.count',
        'Lymph.nodes.with.isolated.tumor.cells.....in.Cancer.specimen.by.Light.microscopy',
        'Lymphocytes....volume..in.Blood.by.Automated.count',
        'Lymphocytes.100.leukocytes.in.Blood.by.Automated.count',
        'MCH..Entitic.mass..by.Automated.count',
        'MCHC..Mass.volume..by.Automated.count',
        'MCV..Entitic.volume..by.Automated.count',
        'Microalbumin.Creatinine..Mass.Ratio..in.Urine',
        'Monocytes....volume..in.Blood.by.Automated.count',
        'Monocytes.100.leukocytes.in.Blood.by.Automated.count',
        'Natriuretic.peptide.B.prohormone.N.Terminal..Mass.volume..in.Serum.or.Plasma',
        'Neutrophils....volume..in.Blood.by.Automated.count',
        'Neutrophils.100.leukocytes.in.Blood.by.Automated.count',
        'Oxygen..Partial.pressure..in.Arterial.blood',
        'Oxygen.saturation.in.Arterial.blood',
        'Oxygen.Inspired.gas.setting..Volume.Fraction..Ventilator',
        'Pain.severity...0.10.verbal.numeric.rating..Score....Reported',
        'Peanut.IgE.Ab..Units.volume..in.Serum',
        'Percentage.area.affected.by.eczema.Head.and.Neck..PhenX.',
        'Percentage.area.affected.by.eczema.Lower.extremity...bilateral..PhenX.',
        'Percentage.area.affected.by.eczema.Trunk..PhenX.',
        'Percentage.area.affected.by.eczema.Upper.extremity...bilateral..PhenX.',
        'pH.of.Arterial.blood',
        'pH.of.Urine.by.Test.strip',
        'Platelet.distribution.width..Entitic.volume..in.Blood.by.Automated.count',
        'Platelet.mean.volume..Entitic.volume..in.Blood.by.Automated.count',
        'Platelets....volume..in.Blood.by.Automated.count',
        'Polyp.size.greatest.dimension',
        'Potassium..Moles.volume..in.Blood',
        'Potassium..Moles.volume..in.Serum.or.Plasma',
        'Procalcitonin..Mass.volume..in.Serum.or.Plasma',
        'Prostate.specific.Ag..Mass.volume..in.Serum.or.Plasma',
        'Protein..Mass.volume..in.Serum.or.Plasma',
        'Protein..Mass.volume..in.Urine.by.Test.strip',
        'Prothrombin.time..PT.',
        'Quality.adjusted.life.years',
        'Quality.of.life.scale',
        'Respiratory.rate',
        'Shrimp.IgE.Ab..Units.volume..in.Serum',
        'Size.maximum.dimension.in.Tumor',
        'Sodium..Moles.volume..in.Blood',
        'Sodium..Moles.volume..in.Serum.or.Plasma',
        'Soybean.IgE.Ab..Units.volume..in.Serum',
        'Specific.gravity.of.Urine.by.Test.strip',
        'Systolic.blood.pressure',
        'Thyrotropin..Units.volume..in.Serum.or.Plasma',
        'Thyroxine..T4..free..Mass.volume..in.Serum.or.Plasma',
        'Triglyceride..Mass.volume..in.Serum.or.Plasma',
        'Troponin.I.cardiac..Mass.volume..in.Serum.or.Plasma.by.High.sensitivity.method',
        'Urea.nitrogen..Mass.volume..in.Blood',
        'Urea.nitrogen..Mass.volume..in.Serum.or.Plasma',
        'Walnut.IgE.Ab..Units.volume..in.Serum',
        'Weight.difference..Mass.difference....pre.dialysis...post.dialysis',
        'Weight.for.length.Per.age.and.sex',
        'Wheat.IgE.Ab..Units.volume..in.Serum',
        'White.Oak.IgE.Ab..Units.volume..in.Serum',
        'Anion.gap.in.Serum.or.Plasma',
        'Bilirubin.total..Mass.volume..in.Blood',
        'Erythrocyte.distribution.width..Ratio.',
        'Erythrocytes....volume..in.Blood',
        'Interleukin.6..Mass.volume..in.Serum.or.Plasma',
        'Leukocytes....volume..in.Blood',
        'Lymph.nodes.with.macrometastases.....in.Cancer.specimen.by.Light.microscopy',
        'Lymph.nodes.with.micrometastases.....in.Cancer.specimen.by.Light.microscopy',
        'MCV..Entitic.volume.',
        'Platelets....volume..in.Blood',
      ],
    },
    {
      id: 'observation',
      label: 'observation',
      variables: [
        'Abuse.Status..OMAHA.',
        'Allergy.to.animal.dander',
        'Allergy.to.bee.venom',
        'Allergy.to.dairy.foods',
        'Allergy.to.dust.mite.protein',
        'Allergy.to.edible.egg',
        'Allergy.to.fish',
        'Allergy.to.grass.pollen',
        'Allergy.to.latex',
        'Allergy.to.mold',
        'Allergy.to.nut',
        'Allergy.to.peanut',
        'Allergy.to.shellfish',
        'Allergy.to.soy.protein',
        'Allergy.to.tree.pollen',
        'Allergy.to.wheat',
        'Are.you.covered.by.health.insurance.or.some.other.kind.of.health.care.plan..PhenX.',
        'Body.mass.index.30....obesity',
        'Body.mass.index.40....severely.obese',
        'Burn.injury',
        'Cause.of.death..US.Standard.Certificate.of.Death.',
        'History.of.appendectomy',
        'History.of.cardiac.arrest',
        'History.of.Hospitalizations.Outpatient.visits.Narrative',
        'History.of.myocardial.infarction',
        'History.of.single.seizure',
        'HIV.status',
        'Housing.status',
        'No.matching.concept',
        'Response.to.cancer.treatment',
        'Sexual.orientation',
        'Smokes.tobacco.daily',
        'Suspected.disease.caused.by.2019.nCoV',
        'Suspected.lung.cancer',
        'Tobacco.smoking.status',
        'Total.score..MMSE.',
        'VR.12.Bodily.pain..BP..score...oblique.method',
        'VR.12.General.health..GH..score...oblique.method',
        'VR.12.Mental.health..MH..score...oblique.method',
        'VR.12.Physical.functioning..PF..score...oblique.method',
        'VR.12.Role.emotion..RE..score...oblique.method',
        'VR.12.Role.physical..RP..score...oblique.method',
        'VR.12.Social.functioning..SF..score...oblique.method',
        'VR.12.Vitality..VT..score...oblique.method',
      ],
    },
    {
      id: 'person',
      label: 'person',
      variables: ['date_of_birth', 'gender', 'race', 'ethnicity'],
    },
    {
      id: 'cohorts',
      label: 'Cohorts',
      variables: ['omop_test', 'test', 'sophia'],
    },
  ],
  variables: [
    {
      id: 'Alanine.aminotransferase..Enzymatic.activity.volume..in.Serum.or.Plasma',
      label:
        'Alanine aminotransferase Enzymatic activity volume in Serum or Plasma',
    },
    {
      id: 'Albumin..Mass.volume..in.Serum.or.Plasma',
      label: 'Albumin Mass volume in Serum or Plasma',
    },
    {
      id: 'Alkaline.phosphatase..Enzymatic.activity.volume..in.Serum.or.Plasma',
      label:
        'Alkaline phosphatase Enzymatic activity volume in Serum or Plasma',
    },
    {
      id: 'American.house.dust.mite.IgE.Ab..Units.volume..in.Serum',
      label: 'American house dust mite IgE Ab Units volume in Serum',
    },
    {
      id: 'Aspartate.aminotransferase..Enzymatic.activity.volume..in.Serum.or.Plasma',
      label:
        'Aspartate aminotransferase Enzymatic activity volume in Serum or Plasma',
    },
    {
      id: 'Basophils....volume..in.Blood.by.Automated.count',
      label: 'Basophils volume in Blood by Automated count',
    },
    {
      id: 'Basophils.100.leukocytes.in.Blood.by.Automated.count',
      label: 'Basophils 100 leukocytes in Blood by Automated count',
    },
    {
      id: 'Bicarbonate..Moles.volume..in.Arterial.blood',
      label: 'Bicarbonate Moles volume in Arterial blood',
    },
    {
      id: 'Bilirubin.total..Mass.volume..in.Serum.or.Plasma',
      label: 'Bilirubin total Mass volume in Serum or Plasma',
    },
    {
      id: 'Bilirubin.total..Mass.volume..in.Urine.by.Test.strip',
      label: 'Bilirubin total Mass volume in Urine by Test strip',
    },
    {
      id: 'Body.height',
      label: 'Body height',
    },
    {
      id: 'Body.mass.index..BMI...Percentile..Per.age.and.sex',
      label: 'Body mass index BMI Percentile Per age and sex',
    },
    {
      id: 'Body.mass.index..BMI...Ratio.',
      label: 'Body mass index BMI Ratio',
    },
    {
      id: 'Body.temperature',
      label: 'Body temperature',
    },
    {
      id: 'Body.weight',
      label: 'Body weight',
    },
    {
      id: 'C.reactive.protein..Mass.volume..in.Serum.or.Plasma',
      label: 'C reactive protein Mass volume in Serum or Plasma',
    },
    {
      id: 'Calcium..Mass.volume..in.Blood',
      label: 'Calcium Mass volume in Blood',
    },
    {
      id: 'Calcium..Mass.volume..in.Serum.or.Plasma',
      label: 'Calcium Mass volume in Serum or Plasma',
    },
    {
      id: 'Carbon.dioxide..Partial.pressure..in.Arterial.blood',
      label: 'Carbon dioxide Partial pressure in Arterial blood',
    },
    {
      id: 'Carbon.dioxide..total..Moles.volume..in.Blood',
      label: 'Carbon dioxide total Moles volume in Blood',
    },
    {
      id: 'Carbon.dioxide..total..Moles.volume..in.Serum.or.Plasma',
      label: 'Carbon dioxide total Moles volume in Serum or Plasma',
    },
    {
      id: 'Cat.dander.IgE.Ab..Units.volume..in.Serum',
      label: 'Cat dander IgE Ab Units volume in Serum',
    },
    {
      id: 'Chloride..Moles.volume..in.Blood',
      label: 'Chloride Moles volume in Blood',
    },
    {
      id: 'Chloride..Moles.volume..in.Serum.or.Plasma',
      label: 'Chloride Moles volume in Serum or Plasma',
    },
    {
      id: 'Cholesterol..Mass.volume..in.Serum.or.Plasma',
      label: 'Cholesterol Mass volume in Serum or Plasma',
    },
    {
      id: 'Cholesterol.in.HDL..Mass.volume..in.Serum.or.Plasma',
      label: 'Cholesterol in HDL Mass volume in Serum or Plasma',
    },
    {
      id: 'Cholesterol.in.LDL..Mass.volume..in.Serum.or.Plasma.by.Direct.assay',
      label:
        'Cholesterol in LDL Mass volume in Serum or Plasma by Direct assay',
    },
    {
      id: 'Cladosporium.herbarum.IgE.Ab..Units.volume..in.Serum',
      label: 'Cladosporium herbarum IgE Ab Units volume in Serum',
    },
    {
      id: 'Codfish.IgE.Ab..Units.volume..in.Serum',
      label: 'Codfish IgE Ab Units volume in Serum',
    },
    {
      id: 'Common.Ragweed.IgE.Ab..Units.volume..in.Serum',
      label: 'Common Ragweed IgE Ab Units volume in Serum',
    },
    {
      id: 'Cow.milk.IgE.Ab..Units.volume..in.Serum',
      label: 'Cow milk IgE Ab Units volume in Serum',
    },
    {
      id: 'Creatine.kinase..Enzymatic.activity.volume..in.Serum.or.Plasma',
      label: 'Creatine kinase Enzymatic activity volume in Serum or Plasma',
    },
    {
      id: 'Creatinine..Mass.volume..in.Blood',
      label: 'Creatinine Mass volume in Blood',
    },
    {
      id: 'Creatinine..Mass.volume..in.Serum.or.Plasma',
      label: 'Creatinine Mass volume in Serum or Plasma',
    },
    {
      id: 'Diastolic.blood.pressure',
      label: 'Diastolic blood pressure',
    },
    {
      id: 'DXA.Radius.and.Ulna..T.score..Bone.density',
      label: 'DXA Radius and Ulna T score Bone density',
    },
    {
      id: 'Egg.white.IgE.Ab..Units.volume..in.Serum',
      label: 'Egg white IgE Ab Units volume in Serum',
    },
    {
      id: 'Eosinophils....volume..in.Blood.by.Automated.count',
      label: 'Eosinophils volume in Blood by Automated count',
    },
    {
      id: 'Eosinophils.100.leukocytes.in.Blood.by.Automated.count',
      label: 'Eosinophils 100 leukocytes in Blood by Automated count',
    },
    {
      id: 'Erythrocyte.distribution.width..Entitic.volume..by.Automated.count',
      label: 'Erythrocyte distribution width Entitic volume by Automated count',
    },
    {
      id: 'Erythrocyte.distribution.width..Ratio..by.Automated.count',
      label: 'Erythrocyte distribution width Ratio by Automated count',
    },
    {
      id: 'Erythrocytes....volume..in.Blood.by.Automated.count',
      label: 'Erythrocytes volume in Blood by Automated count',
    },
    {
      id: 'Ferritin..Mass.volume..in.Serum.or.Plasma',
      label: 'Ferritin Mass volume in Serum or Plasma',
    },
    {
      id: 'FEV1.FVC',
      label: 'FEV1 FVC',
    },
    {
      id: 'Fibrin.D.dimer.FEU..Mass.volume..in.Platelet.poor.plasma',
      label: 'Fibrin D dimer FEU Mass volume in Platelet poor plasma',
    },
    {
      id: 'Globulin..Mass.volume..in.Serum.by.calculation',
      label: 'Globulin Mass volume in Serum by calculation',
    },
    {
      id: 'Glomerular.filtration.rate.1.73.sq.M.predicted..Volume.Rate.Area..in.Serum..Plasma.or.Blood.by.Creatinine.based.formula..MDRD.',
      label:
        'Glomerular filtration rate 1 73 sq M predicted Volume Rate Area in Serum Plasma or Blood by Creatinine based formula MDRD',
    },
    {
      id: 'Glucose..Mass.volume..in.Blood',
      label: 'Glucose Mass volume in Blood',
    },
    {
      id: 'Glucose..Mass.volume..in.Serum.or.Plasma',
      label: 'Glucose Mass volume in Serum or Plasma',
    },
    {
      id: 'Glucose..Mass.volume..in.Urine.by.Test.strip',
      label: 'Glucose Mass volume in Urine by Test strip',
    },
    {
      id: 'Head.Occipital.frontal.circumference',
      label: 'Head Occipital frontal circumference',
    },
    {
      id: 'Heart.rate',
      label: 'Heart rate',
    },
    {
      id: 'Hematocrit..Volume.Fraction..of.Blood',
      label: 'Hematocrit Volume Fraction of Blood',
    },
    {
      id: 'Hematocrit..Volume.Fraction..of.Blood.by.Automated.count',
      label: 'Hematocrit Volume Fraction of Blood by Automated count',
    },
    {
      id: 'Hemoglobin..Mass.volume..in.Blood',
      label: 'Hemoglobin Mass volume in Blood',
    },
    {
      id: 'Hemoglobin.A1c.Hemoglobin.total.in.Blood',
      label: 'Hemoglobin A1c Hemoglobin total in Blood',
    },
    {
      id: 'Hemoglobin.gastrointestinal.lower..Presence..in.Stool.by.Immunoassay...1st.specimen',
      label:
        'Hemoglobin gastrointestinal lower Presence in Stool by Immunoassay 1st specimen',
    },
    {
      id: 'Honey.bee.IgE.Ab..Units.volume..in.Serum',
      label: 'Honey bee IgE Ab Units volume in Serum',
    },
    {
      id: 'INR.in.Platelet.poor.plasma.by.Coagulation.assay',
      label: 'INR in Platelet poor plasma by Coagulation assay',
    },
    {
      id: 'Ketones..Mass.volume..in.Urine.by.Test.strip',
      label: 'Ketones Mass volume in Urine by Test strip',
    },
    {
      id: 'Lactate.dehydrogenase..Enzymatic.activity.volume..in.Serum.or.Plasma.by.Lactate.to.pyruvate.reaction',
      label:
        'Lactate dehydrogenase Enzymatic activity volume in Serum or Plasma by Lactate to pyruvate reaction',
    },
    {
      id: 'Latex.IgE.Ab..Units.volume..in.Serum',
      label: 'Latex IgE Ab Units volume in Serum',
    },
    {
      id: 'Left.ventricular.Ejection.fraction',
      label: 'Left ventricular Ejection fraction',
    },
    {
      id: 'Leukocytes....volume..in.Blood.by.Automated.count',
      label: 'Leukocytes volume in Blood by Automated count',
    },
    {
      id: 'Lymph.nodes.with.isolated.tumor.cells.....in.Cancer.specimen.by.Light.microscopy',
      label:
        'Lymph nodes with isolated tumor cells in Cancer specimen by Light microscopy',
    },
    {
      id: 'Lymphocytes....volume..in.Blood.by.Automated.count',
      label: 'Lymphocytes volume in Blood by Automated count',
    },
    {
      id: 'Lymphocytes.100.leukocytes.in.Blood.by.Automated.count',
      label: 'Lymphocytes 100 leukocytes in Blood by Automated count',
    },
    {
      id: 'MCH..Entitic.mass..by.Automated.count',
      label: 'MCH Entitic mass by Automated count',
    },
    {
      id: 'MCHC..Mass.volume..by.Automated.count',
      label: 'MCHC Mass volume by Automated count',
    },
    {
      id: 'MCV..Entitic.volume..by.Automated.count',
      label: 'MCV Entitic volume by Automated count',
    },
    {
      id: 'Microalbumin.Creatinine..Mass.Ratio..in.Urine',
      label: 'Microalbumin Creatinine Mass Ratio in Urine',
    },
    {
      id: 'Monocytes....volume..in.Blood.by.Automated.count',
      label: 'Monocytes volume in Blood by Automated count',
    },
    {
      id: 'Monocytes.100.leukocytes.in.Blood.by.Automated.count',
      label: 'Monocytes 100 leukocytes in Blood by Automated count',
    },
    {
      id: 'Natriuretic.peptide.B.prohormone.N.Terminal..Mass.volume..in.Serum.or.Plasma',
      label:
        'Natriuretic peptide B prohormone N Terminal Mass volume in Serum or Plasma',
    },
    {
      id: 'Neutrophils....volume..in.Blood.by.Automated.count',
      label: 'Neutrophils volume in Blood by Automated count',
    },
    {
      id: 'Neutrophils.100.leukocytes.in.Blood.by.Automated.count',
      label: 'Neutrophils 100 leukocytes in Blood by Automated count',
    },
    {
      id: 'Oxygen..Partial.pressure..in.Arterial.blood',
      label: 'Oxygen Partial pressure in Arterial blood',
    },
    {
      id: 'Oxygen.saturation.in.Arterial.blood',
      label: 'Oxygen saturation in Arterial blood',
    },
    {
      id: 'Oxygen.Inspired.gas.setting..Volume.Fraction..Ventilator',
      label: 'Oxygen Inspired gas setting Volume Fraction Ventilator',
    },
    {
      id: 'Pain.severity...0.10.verbal.numeric.rating..Score....Reported',
      label: 'Pain severity 0 10 verbal numeric rating Score Reported',
    },
    {
      id: 'Peanut.IgE.Ab..Units.volume..in.Serum',
      label: 'Peanut IgE Ab Units volume in Serum',
    },
    {
      id: 'Percentage.area.affected.by.eczema.Head.and.Neck..PhenX.',
      label: 'Percentage area affected by eczema Head and Neck PhenX',
    },
    {
      id: 'Percentage.area.affected.by.eczema.Lower.extremity...bilateral..PhenX.',
      label:
        'Percentage area affected by eczema Lower extremity bilateral PhenX',
    },
    {
      id: 'Percentage.area.affected.by.eczema.Trunk..PhenX.',
      label: 'Percentage area affected by eczema Trunk PhenX',
    },
    {
      id: 'Percentage.area.affected.by.eczema.Upper.extremity...bilateral..PhenX.',
      label:
        'Percentage area affected by eczema Upper extremity bilateral PhenX',
    },
    {
      id: 'pH.of.Arterial.blood',
      label: 'pH of Arterial blood',
    },
    {
      id: 'pH.of.Urine.by.Test.strip',
      label: 'pH of Urine by Test strip',
    },
    {
      id: 'Platelet.distribution.width..Entitic.volume..in.Blood.by.Automated.count',
      label:
        'Platelet distribution width Entitic volume in Blood by Automated count',
    },
    {
      id: 'Platelet.mean.volume..Entitic.volume..in.Blood.by.Automated.count',
      label: 'Platelet mean volume Entitic volume in Blood by Automated count',
    },
    {
      id: 'Platelets....volume..in.Blood.by.Automated.count',
      label: 'Platelets volume in Blood by Automated count',
    },
    {
      id: 'Polyp.size.greatest.dimension',
      label: 'Polyp size greatest dimension',
    },
    {
      id: 'Potassium..Moles.volume..in.Blood',
      label: 'Potassium Moles volume in Blood',
    },
    {
      id: 'Potassium..Moles.volume..in.Serum.or.Plasma',
      label: 'Potassium Moles volume in Serum or Plasma',
    },
    {
      id: 'Procalcitonin..Mass.volume..in.Serum.or.Plasma',
      label: 'Procalcitonin Mass volume in Serum or Plasma',
    },
    {
      id: 'Prostate.specific.Ag..Mass.volume..in.Serum.or.Plasma',
      label: 'Prostate specific Ag Mass volume in Serum or Plasma',
    },
    {
      id: 'Protein..Mass.volume..in.Serum.or.Plasma',
      label: 'Protein Mass volume in Serum or Plasma',
    },
    {
      id: 'Protein..Mass.volume..in.Urine.by.Test.strip',
      label: 'Protein Mass volume in Urine by Test strip',
    },
    {
      id: 'Prothrombin.time..PT.',
      label: 'Prothrombin time PT',
    },
    {
      id: 'Quality.adjusted.life.years',
      label: 'Quality adjusted life years',
    },
    {
      id: 'Quality.of.life.scale',
      label: 'Quality of life scale',
    },
    {
      id: 'Respiratory.rate',
      label: 'Respiratory rate',
    },
    {
      id: 'Shrimp.IgE.Ab..Units.volume..in.Serum',
      label: 'Shrimp IgE Ab Units volume in Serum',
    },
    {
      id: 'Size.maximum.dimension.in.Tumor',
      label: 'Size maximum dimension in Tumor',
    },
    {
      id: 'Sodium..Moles.volume..in.Blood',
      label: 'Sodium Moles volume in Blood',
    },
    {
      id: 'Sodium..Moles.volume..in.Serum.or.Plasma',
      label: 'Sodium Moles volume in Serum or Plasma',
    },
    {
      id: 'Soybean.IgE.Ab..Units.volume..in.Serum',
      label: 'Soybean IgE Ab Units volume in Serum',
    },
    {
      id: 'Specific.gravity.of.Urine.by.Test.strip',
      label: 'Specific gravity of Urine by Test strip',
    },
    {
      id: 'Systolic.blood.pressure',
      label: 'Systolic blood pressure',
    },
    {
      id: 'Thyrotropin..Units.volume..in.Serum.or.Plasma',
      label: 'Thyrotropin Units volume in Serum or Plasma',
    },
    {
      id: 'Thyroxine..T4..free..Mass.volume..in.Serum.or.Plasma',
      label: 'Thyroxine T4 free Mass volume in Serum or Plasma',
    },
    {
      id: 'Triglyceride..Mass.volume..in.Serum.or.Plasma',
      label: 'Triglyceride Mass volume in Serum or Plasma',
    },
    {
      id: 'Troponin.I.cardiac..Mass.volume..in.Serum.or.Plasma.by.High.sensitivity.method',
      label:
        'Troponin I cardiac Mass volume in Serum or Plasma by High sensitivity method',
    },
    {
      id: 'Urea.nitrogen..Mass.volume..in.Blood',
      label: 'Urea nitrogen Mass volume in Blood',
    },
    {
      id: 'Urea.nitrogen..Mass.volume..in.Serum.or.Plasma',
      label: 'Urea nitrogen Mass volume in Serum or Plasma',
    },
    {
      id: 'Walnut.IgE.Ab..Units.volume..in.Serum',
      label: 'Walnut IgE Ab Units volume in Serum',
    },
    {
      id: 'Weight.difference..Mass.difference....pre.dialysis...post.dialysis',
      label: 'Weight difference Mass difference pre dialysis post dialysis',
    },
    {
      id: 'Weight.for.length.Per.age.and.sex',
      label: 'Weight for length Per age and sex',
    },
    {
      id: 'Wheat.IgE.Ab..Units.volume..in.Serum',
      label: 'Wheat IgE Ab Units volume in Serum',
    },
    {
      id: 'White.Oak.IgE.Ab..Units.volume..in.Serum',
      label: 'White Oak IgE Ab Units volume in Serum',
    },
    {
      id: 'Anion.gap.in.Serum.or.Plasma',
      label: 'Anion gap in Serum or Plasma',
    },
    {
      id: 'Bilirubin.total..Mass.volume..in.Blood',
      label: 'Bilirubin total Mass volume in Blood',
    },
    {
      id: 'Erythrocyte.distribution.width..Ratio.',
      label: 'Erythrocyte distribution width Ratio',
    },
    {
      id: 'Erythrocytes....volume..in.Blood',
      label: 'Erythrocytes volume in Blood',
    },
    {
      id: 'Interleukin.6..Mass.volume..in.Serum.or.Plasma',
      label: 'Interleukin 6 Mass volume in Serum or Plasma',
    },
    {
      id: 'Leukocytes....volume..in.Blood',
      label: 'Leukocytes volume in Blood',
    },
    {
      id: 'Lymph.nodes.with.macrometastases.....in.Cancer.specimen.by.Light.microscopy',
      label:
        'Lymph nodes with macrometastases in Cancer specimen by Light microscopy',
    },
    {
      id: 'Lymph.nodes.with.micrometastases.....in.Cancer.specimen.by.Light.microscopy',
      label:
        'Lymph nodes with micrometastases in Cancer specimen by Light microscopy',
    },
    {
      id: 'MCV..Entitic.volume.',
      label: 'MCV Entitic volume',
    },
    {
      id: 'Platelets....volume..in.Blood',
      label: 'Platelets volume in Blood',
    },
    {
      id: 'Abuse.Status..OMAHA.',
      label: 'Abuse Status OMAHA',
    },
    {
      id: 'Allergy.to.animal.dander',
      label: 'Allergy to animal dander',
    },
    {
      id: 'Allergy.to.bee.venom',
      label: 'Allergy to bee venom',
    },
    {
      id: 'Allergy.to.dairy.foods',
      label: 'Allergy to dairy foods',
    },
    {
      id: 'Allergy.to.dust.mite.protein',
      label: 'Allergy to dust mite protein',
    },
    {
      id: 'Allergy.to.edible.egg',
      label: 'Allergy to edible egg',
    },
    {
      id: 'Allergy.to.fish',
      label: 'Allergy to fish',
    },
    {
      id: 'Allergy.to.grass.pollen',
      label: 'Allergy to grass pollen',
    },
    {
      id: 'Allergy.to.latex',
      label: 'Allergy to latex',
    },
    {
      id: 'Allergy.to.mold',
      label: 'Allergy to mold',
    },
    {
      id: 'Allergy.to.nut',
      label: 'Allergy to nut',
    },
    {
      id: 'Allergy.to.peanut',
      label: 'Allergy to peanut',
    },
    {
      id: 'Allergy.to.shellfish',
      label: 'Allergy to shellfish',
    },
    {
      id: 'Allergy.to.soy.protein',
      label: 'Allergy to soy protein',
    },
    {
      id: 'Allergy.to.tree.pollen',
      label: 'Allergy to tree pollen',
    },
    {
      id: 'Allergy.to.wheat',
      label: 'Allergy to wheat',
    },
    {
      id: 'Are.you.covered.by.health.insurance.or.some.other.kind.of.health.care.plan..PhenX.',
      label:
        'Are you covered by health insurance or some other kind of health care plan PhenX',
    },
    {
      id: 'Body.mass.index.30....obesity',
      label: 'Body mass index 30 obesity',
    },
    {
      id: 'Body.mass.index.40....severely.obese',
      label: 'Body mass index 40 severely obese',
    },
    {
      id: 'Burn.injury',
      label: 'Burn injury',
    },
    {
      id: 'Cause.of.death..US.Standard.Certificate.of.Death.',
      label: 'Cause of death US Standard Certificate of Death',
    },
    {
      id: 'History.of.appendectomy',
      label: 'History of appendectomy',
    },
    {
      id: 'History.of.cardiac.arrest',
      label: 'History of cardiac arrest',
    },
    {
      id: 'History.of.Hospitalizations.Outpatient.visits.Narrative',
      label: 'History of Hospitalizations Outpatient visits Narrative',
    },
    {
      id: 'History.of.myocardial.infarction',
      label: 'History of myocardial infarction',
    },
    {
      id: 'History.of.single.seizure',
      label: 'History of single seizure',
    },
    {
      id: 'HIV.status',
      label: 'HIV status',
    },
    {
      id: 'Housing.status',
      label: 'Housing status',
    },
    {
      id: 'No.matching.concept',
      label: 'No matching concept',
    },
    {
      id: 'Response.to.cancer.treatment',
      label: 'Response to cancer treatment',
    },
    {
      id: 'Sexual.orientation',
      label: 'Sexual orientation',
    },
    {
      id: 'Smokes.tobacco.daily',
      label: 'Smokes tobacco daily',
    },
    {
      id: 'Suspected.disease.caused.by.2019.nCoV',
      label: 'Suspected disease caused by 2019 nCoV',
    },
    {
      id: 'Suspected.lung.cancer',
      label: 'Suspected lung cancer',
    },
    {
      id: 'Tobacco.smoking.status',
      label: 'Tobacco smoking status',
    },
    {
      id: 'Total.score..MMSE.',
      label: 'Total score MMSE',
    },
    {
      id: 'VR.12.Bodily.pain..BP..score...oblique.method',
      label: 'VR 12 Bodily pain BP score oblique method',
    },
    {
      id: 'VR.12.General.health..GH..score...oblique.method',
      label: 'VR 12 General health GH score oblique method',
    },
    {
      id: 'VR.12.Mental.health..MH..score...oblique.method',
      label: 'VR 12 Mental health MH score oblique method',
    },
    {
      id: 'VR.12.Physical.functioning..PF..score...oblique.method',
      label: 'VR 12 Physical functioning PF score oblique method',
    },
    {
      id: 'VR.12.Role.emotion..RE..score...oblique.method',
      label: 'VR 12 Role emotion RE score oblique method',
    },
    {
      id: 'VR.12.Role.physical..RP..score...oblique.method',
      label: 'VR 12 Role physical RP score oblique method',
    },
    {
      id: 'VR.12.Social.functioning..SF..score...oblique.method',
      label: 'VR 12 Social functioning SF score oblique method',
    },
    {
      id: 'VR.12.Vitality..VT..score...oblique.method',
      label: 'VR 12 Vitality VT score oblique method',
    },
    {
      id: 'date_of_birth',
      label: 'date_of_birth',
    },
    {
      id: 'gender',
      label: 'gender',
    },
    {
      id: 'race',
      label: 'race',
    },
    {
      id: 'ethnicity',
      label: 'ethnicity',
    },
    {
      id: 'omop_test',
      label: 'omop_test',
    },
    {
      id: 'test',
      label: 'test',
    },
    {
      id: 'sophia',
      label: 'sophia',
    },
  ],
};

export default class DataShieldService implements IEngineService {
  headers = {};
  constructor(
    @Inject(ENGINE_MODULE_OPTIONS) private readonly options: IEngineOptions,
    private readonly httpService: HttpService,
    @Inject(REQUEST) private readonly req: Request,
  ) {
    const gqlRequest = req['req']; // graphql headers exception
    this.headers =
      gqlRequest && gqlRequest instanceof IncomingMessage
        ? gqlRequest.headers
        : req.headers;
  }

  logout(): void {
    throw new Error('Method not implemented.');
  }

  getAlgorithms(): Algorithm[] | Promise<Algorithm[]> {
    throw new Error('Method not implemented.');
  }

  createExperiment(
    data: ExperimentCreateInput,
    isTransient: boolean,
  ): Experiment | Promise<Experiment> {
    return {
      name: 'placeholder',
      algorithm: {
        id: 'placeholder',
      },
      datasets: [],
      variables: [],
      domain: '',
      id: 'placeholder',
    };
  }

  listExperiments(
    page: number,
    name: string,
  ): ListExperiments | Promise<ListExperiments> {
    return {
      totalExperiments: 0,
      experiments: [],
      totalPages: 0,
      currentPage: 0,
    };
  }

  getExperiment(id: string): Experiment | Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  removeExperiment(id: string): PartialExperiment | Promise<PartialExperiment> {
    throw new Error('Method not implemented.');
  }

  editExperient(
    id: string,
    expriment: ExperimentEditInput,
  ): Experiment | Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  async getDomains(): Promise<Domain[]> {
    const path = this.options.baseurl + 'start';

    /*const response = await firstValueFrom(
      this.httpService.get(path, {
        auth: { username: 'guest', password: 'guest123' },
      }),
    );*/

    //if (this.res) this.res.cookie('test', 'value');
    //else console.log(this.res);

    //response.headers['set-cookie'];

    this.req.res.cookie('test', 'test123', { httpOnly: true });
    //this.req.res.header('some-header', 'some-header');

    return [test];
    //return [transformToDomains.evaluate(response.data)];
  }

  getActiveUser(): string {
    const dummyUser = {
      username: 'anonymous',
      subjectId: 'anonymousId',
      fullname: 'anonymous',
      email: 'anonymous@anonymous.com',
      agreeNDA: true,
    };
    return JSON.stringify(dummyUser);
  }

  editActiveUser(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  getExperimentREST(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  deleteExperiment(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  editExperimentREST(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  startExperimentTransient(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  startExperiment(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  getExperiments(): string {
    return '[]';
  }

  getAlgorithmsREST(): string {
    return '[]';
  }
}
